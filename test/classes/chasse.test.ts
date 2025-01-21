import Chasse from "@/classes/Chasse";
import {
  getChasseById,
  createChasse,
  deleteChasse,
  updateChasse,
  getAllParticipations,
  getAllChassesDisponibles
} from '@/utils/dao/ChasseUtils';
import { addParticipation } from "@/utils/dao/ParticipantUtils";
import { getAllRecompensesByChasse } from "@/utils/dao/RecompenseUtils";
import { getAllAvisByChasse } from "@/utils/dao/AvisUtils";
import { ChasseType } from "@/types";

jest.mock('@/utils/dao/ChasseUtils', () => ({
  getChasseById: jest.fn(),
  createChasse: jest.fn(),
  deleteChasse: jest.fn(),
  updateChasse: jest.fn(),
  getAllChasses: jest.fn(),
  getAllParticipations: jest.fn(),
  getAllChassesDisponibles: jest.fn(),
}));

jest.mock('@/utils/dao/RecompenseUtils', () => ({
  getAllRecompensesByChasse: jest.fn(),
}));

jest.mock('@/utils/dao/AvisUtils', () => ({
  getAllAvisByChasse: jest.fn(),
}));

jest.mock('@/utils/dao/ParticipantUtils', () => ({
  addParticipation: jest.fn(),
}));

describe('Chasse', () => {
  const mockChasseData: ChasseType = {
    id_chasse: "f764ff5d-426f-4c6e-818f-46bfe510f544",
    titre: "Treasure Hunt",
    capacite: 10,
    description: "An exciting adventure.",
    age_requis: 12,
    image: "image-url",
    date_creation: "2025-01-01T00:00:00.000Z",
    date_modification: "2025-01-02T00:00:00.000Z",
    date_debut: "2025-02-01T10:00:00.000Z",
    date_fin: "2025-02-01T14:00:00.000Z",
    prix: 50,
    difficulte: 3,
    duree_estime: "04:00:00",
    theme: "Adventure",
    statut: "Active",
    id_chateau: null,
    id_equipe: "556aaa16-5483-4d2f-8dd2-5e2e7e2a3169",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize correctly', () => {
    const chasse = new Chasse(mockChasseData);

    expect(chasse.getIdChasse()).toBe(mockChasseData.id_chasse);
    expect(chasse.getTitre()).toBe(mockChasseData.titre);
    expect(chasse.getDescription()).toBe(mockChasseData.description);
    expect(chasse.getPrix()).toBe(mockChasseData.prix);
    expect(chasse.getDifficulte()).toBe(mockChasseData.difficulte);
  });

  test('readId should fetch and return a new Chasse instance', async () => {
    (getChasseById as jest.Mock).mockResolvedValue(mockChasseData);

    const chasse = await Chasse.readId("f764ff5d-426f-4c6e-818f-46bfe510f544");

    expect(getChasseById).toHaveBeenCalledWith("f764ff5d-426f-4c6e-818f-46bfe510f544");
    expect(chasse).toBeInstanceOf(Chasse);
    expect(chasse.getTitre()).toBe(mockChasseData.titre);
  });

  test('create should call createChasse with correct data', async () => {
    (createChasse as jest.Mock).mockResolvedValue(mockChasseData);

    const chasse = new Chasse(mockChasseData);
    await chasse.create();

    expect(createChasse).toHaveBeenCalledWith(chasse);
  });

  test('delete should call deleteChasse with instance id', async () => {
    (deleteChasse as jest.Mock).mockResolvedValue(undefined);

    const chasse = new Chasse(mockChasseData);
    await chasse.delete();

    expect(deleteChasse).toHaveBeenCalledWith(mockChasseData.id_chasse);
  });

  test('update should call updateChasse with correct data', async () => {
    (updateChasse as jest.Mock).mockResolvedValue(undefined);

    const chasse = new Chasse(mockChasseData);
    await chasse.update();

    expect(updateChasse).toHaveBeenCalledWith(chasse);
  });

  test('load should fetch data and update instance properties', async () => {
    (getChasseById as jest.Mock).mockResolvedValue({ ...mockChasseData, titre: "Updated Title" });

    const chasse = new Chasse(mockChasseData);
    await chasse.load();

    expect(getChasseById).toHaveBeenCalledWith(mockChasseData.id_chasse);
    expect(chasse.getTitre()).toBe("Updated Title");
  });

  test('getDureeMoyenne should return average duration of participations', async () => {
    const mockParticipations = [
      { duree_totale: 120 },
      { duree_totale: 180 },
    ];
    (getAllParticipations as jest.Mock).mockResolvedValue(mockParticipations);

    const chasse = new Chasse(mockChasseData);
    const avgDuration = await chasse.getDureeMoyenne();

    expect(avgDuration).toBe(150);
  });

  test('getReussiteMoyenne should return average success rate', async () => {
    const mockParticipations = [
      { est_terminee: 1 },
      { est_terminee: 0 },
    ];
    (getAllParticipations as jest.Mock).mockResolvedValue(mockParticipations);

    const chasse = new Chasse(mockChasseData);
    const successRate = await chasse.getReussiteMoyenne();

    expect(successRate).toBe(50);
  });

  test('getNbRecompensesAttribuees should return number of rewards', async () => {
    const mockRecompenses = [{}, {}, {}];
    (getAllRecompensesByChasse as jest.Mock).mockResolvedValue(mockRecompenses);

    const chasse = new Chasse(mockChasseData);
    const rewardsCount = await chasse.getNbRecompensesAttribuees();

    expect(rewardsCount).toBe(3);
  });

  test('getNoteMoyenne should return average note', async () => {
    const mockAvis = [{ note: 4 }, { note: 5 }];
    (getAllAvisByChasse as jest.Mock).mockResolvedValue(mockAvis);

    const chasse = new Chasse(mockChasseData);
    const avgNote = await chasse.getNoteMoyenne();

    expect(avgNote).toBe(4.5);
  });

  test('getAllDisponibles should return a list of Chasse instances', async () => {
    const mockAvailableChasses = [
      mockChasseData,
      { ...mockChasseData, id_chasse: "1234-5678-9012-3456", titre: "Another Hunt" },
    ];

    (getAllChassesDisponibles as jest.Mock).mockResolvedValue(mockAvailableChasses);

    const chasses = await Chasse.getAllDisponibles();

    expect(getAllChassesDisponibles).toHaveBeenCalled();
    expect(chasses).toHaveLength(2);
    expect(chasses[0]).toBeInstanceOf(Chasse);
    expect(chasses[0].getTitre()).toBe(mockChasseData.titre);
    expect(chasses[1].getTitre()).toBe("Another Hunt");
  });

  test('getIndicesMoyens should calculate the correct average', async () => {
    const mockParticipations = [
      { nb_indices_utilises: 2 },
      { nb_indices_utilises: 4 },
      { nb_indices_utilises: 6 },
    ];

    (getAllParticipations as jest.Mock).mockResolvedValue(mockParticipations);

    const chasse = new Chasse(mockChasseData);
    const averageIndices = await chasse.getIndicesMoyens();

    expect(getAllParticipations).toHaveBeenCalledWith(chasse.getIdChasse());
    expect(averageIndices).toBeCloseTo((2 + 4 + 6) / 3);
  });

  test('getIndicesMoyens should return 0 if there are no participations', async () => {
    (getAllParticipations as jest.Mock).mockResolvedValue([]);

    const chasse = new Chasse(mockChasseData);
    const averageIndices = await chasse.getIndicesMoyens();

    expect(getAllParticipations).toHaveBeenCalledWith(chasse.getIdChasse());
    expect(averageIndices).toBe(0);
  });

  test('should add a participant to a chasse', async () => {
    const chasse = new Chasse(mockChasseData);
    const mockParticipantId = "b91280f9-dc78-4f0a-a5f5-fbb17d2f64ae";
    const mockJour = "2025-01-15";

    await chasse.addParticipant(mockParticipantId, mockJour);

    expect(addParticipation).toHaveBeenCalledWith({
      id_participant: mockParticipantId,
      id_chasse: mockChasseData.id_chasse,
      jour: mockJour,
    });

    expect(addParticipation).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if addParticipant fails', async () => {
    const chasse = new Chasse(mockChasseData);
    const mockParticipantId = "b91280f9-dc78-4f0a-a5f5-fbb17d2f64ae";
    const mockJour = "2025-01-15";

    (addParticipation as jest.Mock).mockRejectedValueOnce(new Error("Failed to add participant"));

    await expect(chasse.addParticipant(mockParticipantId, mockJour)).rejects.toThrow("Failed to add participant");

    expect(addParticipation).toHaveBeenCalledWith({
      id_participant: mockParticipantId,
      id_chasse: mockChasseData.id_chasse,
      jour: mockJour,
    });

    expect(addParticipation).toHaveBeenCalledTimes(1);
  });
});