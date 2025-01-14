import EquipeOrganisatrice from "@/classes/EquipeOrganisatrice"; // Ajustez le chemin d'import
import {
  getEquipeById,
  createEquipe,
  deleteEquipe,
  updateEquipe,
  getAllEquipes,
} from '@/utils/dao/EquipeOrganisatriceUtils';
import { EquipeOrganisatriceType } from "@/types";

jest.mock('@/utils/dao/EquipeOrganisatriceUtils', () => ({
  getEquipeById: jest.fn(),
  createEquipe: jest.fn(),
  deleteEquipe: jest.fn(),
  updateEquipe: jest.fn(),
  getAllEquipes: jest.fn(),
}));

describe('EquipeOrganisatrice', () => {
  const mockEquipeData: EquipeOrganisatriceType = {
    id_equipe: "123e4567-e89b-12d3-a456-426614174000",
    type: "Association",
    n_siret: "12345678901234",
    id_taxes: "FR123456789",
    nb_membres: 15,
    site_web: "https://example.com",
    adresse_postale: "123 Rue Exemple, Paris, France",
    telephone: "0123456789",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize correctly', () => {
    const equipe = new EquipeOrganisatrice(mockEquipeData);
    
    expect(equipe.getIdEquipe()).toBe(mockEquipeData.id_equipe);
    expect(equipe.getType()).toBe(mockEquipeData.type);
    expect(equipe.getNSiret()).toBe(mockEquipeData.n_siret);
    expect(equipe.getIdTaxes()).toBe(mockEquipeData.id_taxes);
    expect(equipe.getNbMembres()).toBe(mockEquipeData.nb_membres);
    expect(equipe.getSiteWeb()).toBe(mockEquipeData.site_web);
    expect(equipe.getAdressePostale()).toBe(mockEquipeData.adresse_postale);
    expect(equipe.getTelephone()).toBe(mockEquipeData.telephone);
  });

  test('readId should fetch and return a new EquipeOrganisatrice instance', async () => {
    (getEquipeById as jest.Mock).mockResolvedValue(mockEquipeData);

    const equipe = await EquipeOrganisatrice.readId("123e4567-e89b-12d3-a456-426614174000");

    expect(getEquipeById).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000");
    expect(equipe).toBeInstanceOf(EquipeOrganisatrice);
    expect(equipe.getIdEquipe()).toBe(mockEquipeData.id_equipe);
  });

  test('read should fetch and return a new EquipeOrganisatrice instance', async () => {
    (getEquipeById as jest.Mock).mockResolvedValue(mockEquipeData);

    const equipe = new EquipeOrganisatrice(mockEquipeData);
    const fetchedEquipe = await equipe.read();

    expect(getEquipeById).toHaveBeenCalledWith(mockEquipeData.id_equipe);
    expect(fetchedEquipe).toBeInstanceOf(EquipeOrganisatrice);
  });

  test('create should call createEquipe with correct data', async () => {
    (createEquipe as jest.Mock).mockResolvedValue(mockEquipeData);

    const equipe = new EquipeOrganisatrice(mockEquipeData);
    await equipe.create();

    expect(createEquipe).toHaveBeenCalledWith(equipe);
  });

  test('deleteId should call deleteEquipe with correct id', async () => {
    (deleteEquipe as jest.Mock).mockResolvedValue(undefined);

    const equipe = new EquipeOrganisatrice(mockEquipeData);
    await equipe.deleteId(mockEquipeData.id_equipe);

    expect(deleteEquipe).toHaveBeenCalledWith(mockEquipeData.id_equipe);
  });

  test('delete should call deleteEquipe with instance id', async () => {
    (deleteEquipe as jest.Mock).mockResolvedValue(undefined);

    const equipe = new EquipeOrganisatrice(mockEquipeData);
    await equipe.delete();

    expect(deleteEquipe).toHaveBeenCalledWith(mockEquipeData.id_equipe);
  });

  test('update should call updateEquipe with correct data', async () => {
    (updateEquipe as jest.Mock).mockResolvedValue(undefined);

    const equipe = new EquipeOrganisatrice(mockEquipeData);
    await equipe.update();

    expect(updateEquipe).toHaveBeenCalledWith(equipe);
  });

  test('load should fetch data and update instance properties', async () => {
    (getEquipeById as jest.Mock).mockResolvedValue({ ...mockEquipeData, nb_membres: 20 });

    const equipe = new EquipeOrganisatrice(mockEquipeData);
    await equipe.load();

    expect(getEquipeById).toHaveBeenCalledWith(mockEquipeData.id_equipe);
    expect(equipe.getNbMembres()).toBe(20);
  });

  test('getAllEquipes should fetch and return a list of EquipeOrganisatrice instances', async () => {
    (getAllEquipes as jest.Mock).mockResolvedValue([mockEquipeData]);

    const equipes = await EquipeOrganisatrice.getAllEquipes();

    expect(getAllEquipes).toHaveBeenCalled();
    expect(equipes).toHaveLength(1);
    expect(equipes[0]).toBeInstanceOf(EquipeOrganisatrice);
    expect(equipes[0].getIdEquipe()).toBe(mockEquipeData.id_equipe);
  });

  test('read should throw an error if id_equipe is missing', async () => {
    const equipe = new EquipeOrganisatrice({ ...mockEquipeData, id_equipe: undefined } as any);

    await expect(equipe.read()).rejects.toThrow('Equipe ID is required');
  });
});