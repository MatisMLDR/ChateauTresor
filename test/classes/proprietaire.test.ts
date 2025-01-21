import { Proprietaire } from '@/classes/Proprietaire';
import {
  createProprietaire,
  deleteProprietaire,
  getProprietaireById,
  getProprietaireByUserId,
  updateProprietaire,
} from '@/utils/dao/ProprietaireUtils';
import { ProprietaireType } from '@/types';

jest.mock('@/utils/dao/ProprietaireUtils', () => ({
  createProprietaire: jest.fn(),
  deleteProprietaire: jest.fn(),
  getProprietaireById: jest.fn(),
  getProprietaireByUserId: jest.fn(),
  updateProprietaire: jest.fn(),
}));

describe('Proprietaire', () => {
  const mockProprietaireData: ProprietaireType = {
    id_proprietaire: '123e4567-e89b-12d3-a456-426614174000',
    id_user: '789e4567-e89b-12d3-a456-426614174111',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize correctly', () => {
    const proprietaire = new Proprietaire(mockProprietaireData);

    expect(proprietaire.getIdProprietaire()).toBe(mockProprietaireData.id_proprietaire);
    expect(proprietaire.getIdUser()).toBe(mockProprietaireData.id_user);
  });

  test('readId should fetch and return a new Proprietaire instance', async () => {
    (getProprietaireById as jest.Mock).mockResolvedValue(mockProprietaireData);

    const proprietaire = await Proprietaire.readId(mockProprietaireData.id_proprietaire);

    expect(getProprietaireById).toHaveBeenCalledWith(mockProprietaireData.id_proprietaire);
    expect(proprietaire).toBeInstanceOf(Proprietaire);
    expect(proprietaire.getIdProprietaire()).toBe(mockProprietaireData.id_proprietaire);
  });

  test('readByIdUser should fetch and return a new Proprietaire instance', async () => {
    (getProprietaireByUserId as jest.Mock).mockResolvedValue(mockProprietaireData);

    const proprietaire = await Proprietaire.readByIdUser(mockProprietaireData.id_user);

    expect(getProprietaireByUserId).toHaveBeenCalledWith(mockProprietaireData.id_user);
    expect(proprietaire).toBeInstanceOf(Proprietaire);
    expect(proprietaire.getIdUser()).toBe(mockProprietaireData.id_user);
  });

  test('create should call createProprietaire with correct data', async () => {
    (createProprietaire as jest.Mock).mockResolvedValue(mockProprietaireData);

    const proprietaire = new Proprietaire(mockProprietaireData);
    await proprietaire.create();

    expect(createProprietaire).toHaveBeenCalledWith(proprietaire);
  });

  test('deleteId should call deleteProprietaire with correct id', async () => {
    (deleteProprietaire as jest.Mock).mockResolvedValue(undefined);

    await Proprietaire.prototype.deleteId(mockProprietaireData.id_proprietaire);

    expect(deleteProprietaire).toHaveBeenCalledWith(mockProprietaireData.id_proprietaire);
  });

  test('delete should call deleteProprietaire with instance id', async () => {
    (deleteProprietaire as jest.Mock).mockResolvedValue(undefined);

    const proprietaire = new Proprietaire(mockProprietaireData);
    await proprietaire.delete();

    expect(deleteProprietaire).toHaveBeenCalledWith(mockProprietaireData.id_proprietaire);
  });

  test('update should call updateProprietaire with correct data', async () => {
    (updateProprietaire as jest.Mock).mockResolvedValue(undefined);

    const proprietaire = new Proprietaire(mockProprietaireData);
    await proprietaire.update();

    expect(updateProprietaire).toHaveBeenCalledWith(proprietaire);
  });

  test('load should fetch data and update instance properties', async () => {
    const updatedData = { ...mockProprietaireData, id_user: 'updated-user-id' };
    (getProprietaireById as jest.Mock).mockResolvedValue(updatedData);

    const proprietaire = new Proprietaire(mockProprietaireData);
    await proprietaire.load();

    expect(getProprietaireById).toHaveBeenCalledWith(mockProprietaireData.id_proprietaire);
    expect(proprietaire.getIdUser()).toBe('updated-user-id');
  });

  test('read should fetch data and return a new Proprietaire instance', async () => {
    (getProprietaireById as jest.Mock).mockResolvedValue(mockProprietaireData);

    const proprietaire = new Proprietaire(mockProprietaireData);
    const fetchedProprietaire = await proprietaire.read();

    expect(getProprietaireById).toHaveBeenCalledWith(mockProprietaireData.id_proprietaire);
    expect(fetchedProprietaire).toBeInstanceOf(Proprietaire);
  });

  test('read should throw an error if id_proprietaire is missing', async () => {
    const proprietaire = new Proprietaire({ ...mockProprietaireData, id_proprietaire: undefined } as any);

    await expect(proprietaire.read()).rejects.toThrow('proprietaire ID is required');
  });
});