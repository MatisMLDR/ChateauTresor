import Avis from "@/classes/Avis"; // Ajustez le chemin d'import
import { getAvisById, createAvis, deleteAvis, updateAvis } from '@/utils/dao/AvisUtils';
import { AvisType } from "@/types";

jest.mock('@/utils/dao/AvisUtils', () => ({
  getAvisById: jest.fn(),
  createAvis: jest.fn(),
  deleteAvis: jest.fn(),
  updateAvis: jest.fn(),
}));

describe('Avis', () => {
  const mockAvisData: AvisType = {
    id_avis: 1,
    note: 5,
    titre: "Great experience",
    description: "It was fantastic!",
    nb_like: 10,
    date_modification: "2025-01-01",
    id_chasse: 2,
    id_participant: 3
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize correctly', () => {
    const avis = new Avis(mockAvisData);

    expect(avis.getIdAvis()).toBe(mockAvisData.id_avis);
    expect(avis.getNote()).toBe(mockAvisData.note);
    expect(avis.getTitre()).toBe(mockAvisData.titre);
    expect(avis.getDescription()).toBe(mockAvisData.description);
    expect(avis.getNbLike()).toBe(mockAvisData.nb_like);
    expect(avis.getDateModification()).toBe(mockAvisData.date_modification);
    expect(avis.getIdChasse()).toBe(mockAvisData.id_chasse);
    expect(avis.getIdParticipant()).toBe(mockAvisData.id_participant);
  });

  test('readId should fetch and return a new Avis instance', async () => {
    (getAvisById as jest.Mock).mockResolvedValue(mockAvisData);

    const avis = await Avis.readId(1);

    expect(getAvisById).toHaveBeenCalledWith(1);
    expect(avis).toBeInstanceOf(Avis);
    expect(avis.getIdAvis()).toBe(mockAvisData.id_avis);
  });

  test('read should fetch and return a new Avis instance', async () => {
    (getAvisById as jest.Mock).mockResolvedValue(mockAvisData);

    const avis = new Avis(mockAvisData);
    const fetchedAvis = await avis.read();

    expect(getAvisById).toHaveBeenCalledWith(mockAvisData.id_avis);
    expect(fetchedAvis).toBeInstanceOf(Avis);
  });

  test('create should call createAvis with correct data', async () => {
    (createAvis as jest.Mock).mockResolvedValue(mockAvisData);

    const avis = new Avis(mockAvisData);
    await avis.create();

    expect(createAvis).toHaveBeenCalledWith(avis);
  });

  test('deleteId should call deleteAvis with correct id', async () => {
    (deleteAvis as jest.Mock).mockResolvedValue(undefined);

    const avis = new Avis(mockAvisData);
    await avis.deleteId(mockAvisData.id_avis);

    expect(deleteAvis).toHaveBeenCalledWith(mockAvisData.id_avis);
  });

  test('delete should call deleteAvis with instance id', async () => {
    (deleteAvis as jest.Mock).mockResolvedValue(undefined);

    const avis = new Avis(mockAvisData);
    await avis.delete();

    expect(deleteAvis).toHaveBeenCalledWith(mockAvisData.id_avis);
  });

  test('update should call updateAvis with correct data', async () => {
    (updateAvis as jest.Mock).mockResolvedValue(undefined);

    const avis = new Avis(mockAvisData);
    await avis.update();

    expect(updateAvis).toHaveBeenCalledWith(avis);
  });

  test('load should fetch data and update instance properties', async () => {
    (getAvisById as jest.Mock).mockResolvedValue({ ...mockAvisData, note: 4 });

    const avis = new Avis(mockAvisData);
    await avis.load();

    expect(getAvisById).toHaveBeenCalledWith(mockAvisData.id_avis);
    expect(avis.getNote()).toBe(4);
  });

  test('read should throw an error if id_avis is missing', async () => {
    const avis = new Avis({ ...mockAvisData, id_avis: undefined } as any);

    await expect(avis.read()).rejects.toThrow('Avis ID is required');
  });
});
