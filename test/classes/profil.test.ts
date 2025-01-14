import { Profil } from "@/classes/Profil";
import { ProfilType } from "@/types";
import { getProfilById, updateProfil, createProfil, deleteProfil } from "@/utils/dao/ProfilUtils";

jest.mock("@/utils/dao/ProfilUtils");

describe("Profil Class", () => {
  const mockProfile: ProfilType = {
    id_profil: "69bd765a-53b5-4639-b835-da7031139ecf",
    username: "testuser",
    updated_at: "2023-01-01",
    email: "testuser@example.com",
    birthday: "2000-01-01",
    email_confirm: true,
    nom: "Nom",
    prenom: "Prénom",
    adresse: "123 Rue Test",
    ville: "Testville",
    code_postal: "12345",
    stripe_id: null,
    plan: "free",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of Profil", () => {
    const profil = new Profil(mockProfile);
    expect(profil.getId()).toBe("69bd765a-53b5-4639-b835-da7031139ecf");
    expect(profil.getUsername()).toBe("testuser");
    expect(profil.getEmail()).toBe("testuser@example.com");
    expect(profil.getNom()).toBe("Nom");
    expect(profil.getPlan()).toBe("free");
  });

  it("should retrieve a Profil by ID", async () => {
    (getProfilById as jest.Mock).mockResolvedValue(mockProfile);
    const profil = await Profil.readId("69bd765a-53b5-4639-b835-da7031139ecf");
    expect(profil.getId()).toBe("69bd765a-53b5-4639-b835-da7031139ecf");
    expect(getProfilById).toHaveBeenCalledWith("69bd765a-53b5-4639-b835-da7031139ecf");
  });

  it("should throw an error if Profil not found", async () => {
    (getProfilById as jest.Mock).mockResolvedValue(null);
    await expect(Profil.readId("69bd765a-53b5-4639-b835-da7031139ecd")).rejects.toThrow("Profil introuvable");
  });

  it("should load Profil data into instance", async () => {
    const profil = new Profil(mockProfile);
    (getProfilById as jest.Mock).mockResolvedValue(mockProfile);
    await profil.load();
    expect(profil.getNom()).toBe("Nom");
    expect(profil.getVille()).toBe("Testville");
  });

  it("should create a new Profil", async () => {
    (createProfil as jest.Mock).mockResolvedValue(mockProfile);
    const profil = new Profil(mockProfile);
    await profil.create();
    expect(createProfil).toHaveBeenCalledWith(profil);
  });

  it("should update an existing Profil", async () => {
    (updateProfil as jest.Mock).mockResolvedValue(true);
    const profil = new Profil(mockProfile);
    await profil.update();
    expect(updateProfil).toHaveBeenCalledWith(profil);
  });

  it("should delete a Profil by ID", async () => {
    (deleteProfil as jest.Mock).mockResolvedValue(true);
    const profil = new Profil(mockProfile);
    await profil.deleteId("69bd765a-53b5-4639-b835-da7031139ecf");
    expect(deleteProfil).toHaveBeenCalledWith("69bd765a-53b5-4639-b835-da7031139ecf");
  });

  it("should throw an error when deleting a non-existent Profil", async () => {
    (deleteProfil as jest.Mock).mockRejectedValue(new Error("Profil does not exist"));
    const profil = new Profil(mockProfile);
    await expect(profil.deleteId("69bd765a-53b5-4639-b835-da7031139ecd")).rejects.toThrow("Profil does not exist");
  });

  it("should retrieve all profile data as an object", () => {
    const profil = new Profil(mockProfile);
    const profileData = profil.getProfile();
    expect(profileData).toEqual(mockProfile);
  });
});
