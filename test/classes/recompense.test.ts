import Recompense from '@/classes/Recompense';
import { createRecompense, deleteRecompense, getRecompenseById, updateRecompense } from '@/utils/dao/RecompenseUtils';
import { RecompenseType } from '@/types';

jest.mock('@/utils/dao/RecompenseUtils');

describe('Recompense Class', () => {
  const mockRecompenseData: RecompenseType = {
    id_recompense: "b951df7c-1607-43b8-9627-d6d0823354c7",
    nom: 'Test Recompense',
    description: 'A description of the reward.',
    type: 'gift',
    valeur: 100,
    quantite_dispo: 10,
    prix_reel: 50,
    image: 'image_url',
    date_modification: '2023-12-01',
    id_chasse: "f78cc6d8-cf29-47e5-9c36-d997afc27aba",
  };

  it('should create a Recompense instance', () => {
    const recompense = new Recompense(mockRecompenseData);

    expect(recompense.getIdRecompense()).toBe(mockRecompenseData.id_recompense);
    expect(recompense.getNom()).toBe(mockRecompenseData.nom);
    expect(recompense.getDescription()).toBe(mockRecompenseData.description);
    expect(recompense.getType()).toBe(mockRecompenseData.type);
    expect(recompense.getValeur()).toBe(mockRecompenseData.valeur);
    expect(recompense.getQuantiteDispo()).toBe(mockRecompenseData.quantite_dispo);
    expect(recompense.getPrixReel()).toBe(mockRecompenseData.prix_reel);
    expect(recompense.getImage()).toBe(mockRecompenseData.image);
    expect(recompense.getDateModification()).toBe(mockRecompenseData.date_modification);
    expect(recompense.getIdChasse()).toBe(mockRecompenseData.id_chasse);
  });

  it('should read a Recompense by ID', async () => {
    (getRecompenseById as jest.Mock).mockResolvedValue(mockRecompenseData);

    const recompense = await Recompense.readId("b951df7c-1607-43b8-9627-d6d0823354c7");

    expect(getRecompenseById).toHaveBeenCalledWith("b951df7c-1607-43b8-9627-d6d0823354c7");
    expect(recompense).toBeInstanceOf(Recompense);
    expect(recompense.getNom()).toBe(mockRecompenseData.nom);
  });

  it('should throw an error when reading a non-existent Recompense', async () => {
    (getRecompenseById as jest.Mock).mockResolvedValue(null);

    await expect(Recompense.readId("f78cc6d8-cf29-47e5-9c36-d997afc27abb")).rejects.toThrow('Recompense not found');
  });

  it('should create a new Recompense', async () => {
    (createRecompense as jest.Mock).mockResolvedValue(mockRecompenseData);

    const recompense = new Recompense(mockRecompenseData);
    await recompense.create();

    expect(createRecompense).toHaveBeenCalledWith(recompense);
  });

  it('should delete a Recompense by ID', async () => {
    (deleteRecompense as jest.Mock).mockResolvedValue(undefined);

    await Recompense.prototype.deleteId("f78cc6d8-cf29-47e5-9c36-d997afc27aba");

    expect(deleteRecompense).toHaveBeenCalledWith("f78cc6d8-cf29-47e5-9c36-d997afc27aba");
  });

  it('should update a Recompense', async () => {
    (updateRecompense as jest.Mock).mockResolvedValue(undefined);

    const recompense = new Recompense(mockRecompenseData);
    recompense.setNom('Updated Recompense');

    await recompense.update();

    expect(updateRecompense).toHaveBeenCalledWith(recompense);
  });

  it('should load data into an existing Recompense instance', async () => {
    (getRecompenseById as jest.Mock).mockResolvedValue(mockRecompenseData);

    const recompense = new Recompense({ ...mockRecompenseData, id_recompense: "f78cc6d8-cf29-47e5-9c36-d997afc27aba", nom: 'Old Name' });

    await recompense.load();

    expect(getRecompenseById).toHaveBeenCalledWith("f78cc6d8-cf29-47e5-9c36-d997afc27aba");
    expect(recompense.getNom()).toBe(mockRecompenseData.nom);
  });

  it('should throw an error when trying to delete without an ID', async () => {
    const recompense = new Recompense({ ...mockRecompenseData, id_recompense: undefined });

    await expect(recompense.delete()).rejects.toThrow('id_recompense is required');
  });
});
