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
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    id_user: "74df808b-48de-4a7b-b26f-e581a06f75b3",
    adresse: "123 Main St",
    ville: "Anytown",
    code_postal: "12345",
    birthday: "1990-01-01",
    plan: "premium",
    updated_at: "2025-01-01",
    stripe_id: "stripe_123",
  };

  let participant: Participant;

  beforeEach(() => {
    participant = new Participant(mockParticipantData);
  });

  it("should instantiate correctly", () => {
    expect(participant.getNom()).toBe("Doe");
    expect(participant.getPrenom()).toBe("John");
    expect(participant.getEmail()).toBe("john.doe@example.com");
  });

  it("should return correct participant data", () => {
    const data = participant.getParticipant();
    expect(data).toEqual(mockParticipantData);
  });

  it("should update participant fields", () => {
    participant.setNom("Smith");
    participant.setEmail("smith.john@example.com");

    expect(participant.getNom()).toBe("Smith");
    expect(participant.getEmail()).toBe("smith.john@example.com");
  });

  it("should fetch participant by ID", async () => {
    (getParticipantById as jest.Mock).mockResolvedValue(mockParticipantData);
    const fetchedParticipant = await Participant.readId("8a5ff2e7-2852-479a-9aa0-abdc505adb88");

    expect(fetchedParticipant.getNom()).toBe("Doe");
    expect(getParticipantById).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
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

  it("should fetch participant by user ID", async () => {
    // Simuler la réponse de getParticipantByUserId
    (getParticipantByUserId as jest.Mock).mockResolvedValue(mockParticipantData);
  
    // Appeler la méthode readByIdUser
    const fetchedParticipant = await Participant.readByIdUser("74df808b-48de-4a7b-b26f-e581a06f75b3");
  
    // Vérifier que les données retournées sont correctes
    expect(fetchedParticipant.getNom()).toBe("Doe");
    expect(fetchedParticipant.getPrenom()).toBe("John");
    expect(fetchedParticipant.getEmail()).toBe("john.doe@example.com");
  
    // Vérifier que la fonction getParticipantByUserId a été appelée avec le bon ID utilisateur
    expect(getParticipantByUserId).toHaveBeenCalledWith("74df808b-48de-4a7b-b26f-e581a06f75b3");
  });

  it("should read a participant using read()", async () => {
    (getParticipantById as jest.Mock).mockResolvedValue(mockParticipantData);

    const fetchedParticipant = await participant.read();

    expect(fetchedParticipant.getNom()).toBe("Doe");
    expect(getParticipantById).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
  });

  it("should load data into the participant instance using load()", async () => {
    const updatedData = { ...mockParticipantData, nom: "Smith" };
    (getParticipantById as jest.Mock).mockResolvedValue(updatedData);

    await participant.load();

    expect(participant.getNom()).toBe("Smith");
    expect(getParticipantById).toHaveBeenCalledWith("8a5ff2e7-2852-479a-9aa0-abdc505adb88");
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
