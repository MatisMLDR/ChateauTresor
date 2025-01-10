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
  getAllParticipantEnigmes,
} from "@/utils/dao/ParticipantUtils";

jest.mock("@/utils/dao/ParticipantUtils");

describe("Participant Class", () => {
  const mockParticipantData: ParticipantType = {
    id_participant: 1,
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    id_user: "user_123",
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
    const fetchedParticipant = await Participant.readId(1);

    expect(fetchedParticipant.getNom()).toBe("Doe");
    expect(getParticipantById).toHaveBeenCalledWith(1);
  });

  it("should create a new participant", async () => {
    (createParticipant as jest.Mock).mockResolvedValue(mockParticipantData);
    await participant.create();

    expect(createParticipant).toHaveBeenCalledWith(participant);
  });

  it("should delete a participant by ID", async () => {
    await participant.deleteId(1);
    expect(deleteParticipant).toHaveBeenCalledWith(1);
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
    expect(getAllParticipantChasses).toHaveBeenCalledWith(1);
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
    expect(getAllParticipantAvis).toHaveBeenCalledWith(1);
  });

  it("should calculate average avis note", async () => {
    const mockAvis = [{ note: 5 }, { note: 3 }];
    (getAllParticipantAvis as jest.Mock).mockResolvedValue(mockAvis);

    const avgNote = await participant.getNoteMoyenneDonnee();
    expect(avgNote).toBe(4);
  });
});
