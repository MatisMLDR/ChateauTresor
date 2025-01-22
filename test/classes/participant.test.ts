import { Participant } from "@/classes/Participant";
import { ParticipantType } from "@/types";
import {
  getParticipantById,
  createParticipant,
  deleteParticipant,
  updateParticipant,
  getAllParticipantChasses,
  getAllParticipantAvis,
  getAllParticipantIndice,
  getParticipantByUserId,
  getAllParticipantEnigmes,
} from "@/utils/dao/ParticipantUtils";

jest.mock("@/utils/dao/ParticipantUtils");

describe("Participant Class", () => {
  const mockParticipantData: ParticipantType = {
    id_participant: "8a5ff2e7-2852-479a-9aa0-abdc505adb88",
    id_user: "74df808b-48de-4a7b-b26f-e581a06f75b3",
  };

  let participant: Participant;

  beforeEach(() => {
    participant = new Participant(mockParticipantData);
  });

  test('should initialize correctly', () => {
    const participant = new Participant(mockParticipantData);

    expect(participant.getIdParticipant()).toBe(mockParticipantData.id_participant);
    expect(participant.getIdUser()).toBe(mockParticipantData.id_user);
  });

  it("should return correct participant data", () => {
    const data = participant.getParticipant();
    expect(data).toEqual(mockParticipantData);
  });

  test('update should call updateParticipant with correct data', async () => {
    (updateParticipant as jest.Mock).mockResolvedValue(undefined);

    const participant = new Participant(mockParticipantData);
    await participant.update();

    expect(updateParticipant).toHaveBeenCalledWith(participant);
  });

  test('readId should fetch and return a new Participant instance', async () => {
    (getParticipantById as jest.Mock).mockResolvedValue(mockParticipantData);

    const participant = await Participant.readId("123e4567-e89b-12d3-a456-426614174000");

    expect(getParticipantById).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000");
    expect(participant).toBeInstanceOf(Participant);
    expect(participant.getIdParticipant()).toBe(mockParticipantData.id_participant);
  });

  it("should create a new participant", async () => {
    (createParticipant as jest.Mock).mockResolvedValue(mockParticipantData);
    await participant.create();

    expect(createParticipant).toHaveBeenCalledWith(participant);
  });

  it("should delete a participant by ID", async () => {
    await participant.deleteId("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
    expect(deleteParticipant).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should update a participant", async () => {
    await participant.update();
    expect(updateParticipant).toHaveBeenCalledWith(participant);
  });

  it("should fetch all participant chasses", async () => {
    const mockChasses = [{ score: 10 }, { score: 20 }];
    (getAllParticipantChasses as jest.Mock).mockResolvedValue(mockChasses);

    const chasses = await participant.getAllChasses();
    expect(chasses).toEqual(mockChasses);
    expect(getAllParticipantChasses).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate the best chasse score", async () => {
    const mockChasses = [{ score: 10 }, { score: 20 }, { score: 15 }];
    (getAllParticipantChasses as jest.Mock).mockResolvedValue(mockChasses);

    const bestScore = await participant.getBestScoreChasse();
    expect(bestScore).toBe(20);
  });

  it("should calculate average chasse duration", async () => {
    const mockChasses = [{ duree_totale: 100 }, { duree_totale: 200 }];
    (getAllParticipantChasses as jest.Mock).mockResolvedValue(mockChasses);

    const avgDuration = await participant.getDureeMoyenneChasse();
    expect(avgDuration).toBe(150);
  });

  it("should calculate average indices used", async () => {
    const mockIndices = [{ est_decouvert: 1 }, { est_decouvert: 0 }];
    (getAllParticipantIndice as jest.Mock).mockResolvedValue(mockIndices);

    const avgIndices = await participant.getIndicesMoyens();
    expect(avgIndices).toBe(0.5);
  });

  it("should fetch all participant avis", async () => {
    const mockAvis = [{ note: 5 }, { note: 4 }];
    (getAllParticipantAvis as jest.Mock).mockResolvedValue(mockAvis);

    const avis = await participant.getAllAvisDonnes();
    expect(avis).toEqual(mockAvis);
    expect(getAllParticipantAvis).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate average avis note", async () => {
    const mockAvis = [{ note: 5 }, { note: 3 }];
    (getAllParticipantAvis as jest.Mock).mockResolvedValue(mockAvis);

    const avgNote = await participant.getNoteMoyenneDonnee();
    expect(avgNote).toBe(4);
  });

  test('readByIdUser should fetch and return a new Participant instance', async () => {
    (getParticipantByUserId as jest.Mock).mockResolvedValue(mockParticipantData);

    const participant = await Participant.readByIdUser("456e7890-a12b-34c5-d678-987654321000");

    expect(getParticipantByUserId).toHaveBeenCalledWith("456e7890-a12b-34c5-d678-987654321000");
    expect(participant).toBeInstanceOf(Participant);
  });

  test('load should fetch data and update instance properties', async () => {
    (getParticipantById as jest.Mock).mockResolvedValue({
      ...mockParticipantData,
      id_user: "updated-id-user",
    });

    const participant = new Participant(mockParticipantData);
    await participant.load();

    expect(getParticipantById).toHaveBeenCalledWith(mockParticipantData.id_participant);
    expect(participant.getIdUser()).toBe("updated-id-user");
  });

  it("should calculate average success rate of chasses", async () => {
    const mockChasses = [
      { est_terminee: 1 },
      { est_terminee: 0 },
      { est_terminee: 1 },
    ];
    (getAllParticipantChasses as jest.Mock).mockResolvedValue(mockChasses);

    const successRate = await participant.getReussiteMoyenneChasse();

    expect(successRate).toBe(0.6666666666666666);
    expect(getAllParticipantChasses).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate average score of chasses", async () => {
    const mockChasses = [
      { score: 10 },
      { score: 20 },
      { score: 15 },
    ];
    (getAllParticipantChasses as jest.Mock).mockResolvedValue(mockChasses);

    const averageScore = await participant.getScoreMoyenChasse();

    expect(averageScore).toBe(15);
    expect(getAllParticipantChasses).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate total number of chasse participations", async () => {
    const mockChasses = [
      { score: 10 },
      { score: 20 },
      { score: 15 },
    ];
    (getAllParticipantChasses as jest.Mock).mockResolvedValue(mockChasses);

    const totalParticipations = await participant.getNbParticipationsChasse();

    expect(totalParticipations).toBe(3);
    expect(getAllParticipantChasses).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate average time for solving enigmas", async () => {
    const mockEnigmas = [
      { duree: 100 },
      { duree: 200 },
    ];
    (getAllParticipantEnigmes as jest.Mock).mockResolvedValue(mockEnigmas);

    const averageTime = await participant.getTempsMoyenResolutionEnigme();

    expect(averageTime).toBe(150);
    expect(getAllParticipantEnigmes).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate total number of enigmas resolved", async () => {
    const mockEnigmas = [
      { duree: 100 },
      { duree: 200 },
    ];
    (getAllParticipantEnigmes as jest.Mock).mockResolvedValue(mockEnigmas);

    const totalResolved = await participant.getNbEnigmesResolues();

    expect(totalResolved).toBe(2);
    expect(getAllParticipantEnigmes).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate total number of completed chasses", async () => {
    const mockChasses = [
      { est_terminee: true },
      { est_terminee: false },
      { est_terminee: true },
    ];
    (getAllParticipantChasses as jest.Mock).mockResolvedValue(mockChasses);

    const completedChasses = await participant.getNbChassesTerminees();

    expect(completedChasses).toBe(2);
    expect(getAllParticipantChasses).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should calculate total number of given avis", async () => {
    const mockAvis = [
      { note: 5 },
      { note: 4 },
    ];
    (getAllParticipantAvis as jest.Mock).mockResolvedValue(mockAvis);

    const totalAvis = await participant.getNbAvisDonnes();

    expect(totalAvis).toBe(2);
    expect(getAllParticipantAvis).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });
});
