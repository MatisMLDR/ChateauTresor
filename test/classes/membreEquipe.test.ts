import { MembreEquipeClass } from "@/classes/MembreEquipe";
import { createMembre, deleteMembre, getMembreById, updateMembre } from "@/utils/dao/MembreEquipeUtils";

jest.mock("@/utils/dao/MembreEquipeUtils");

describe("MembreEquipeClass", () => {
  const mockMembre = {
    id_membre: 1,
    carte_identite: "12345ABC",
    est_verifie: true,
    role_equipe: "Admin",
    id_user: "user123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of MembreEquipe", () => {
    const membre = new MembreEquipeClass(mockMembre);
    expect(membre.getIdMembre()).toBe(1);
    expect(membre.getCarteIdentite()).toBe("12345ABC");
    expect(membre.isVerifie()).toBe(true);
    expect(membre.getRoleEquipe()).toBe("Admin");
    expect(membre.getIdUser()).toBe("user123");
  });

  it("should retrieve a MembreEquipe by ID", async () => {
    (getMembreById as jest.Mock).mockResolvedValue(mockMembre);
    const membre = await MembreEquipeClass.readId(1);
    expect(membre.getIdMembre()).toBe(1);
    expect(getMembreById).toHaveBeenCalledWith(1);
  });

  it("should throw an error if MembreEquipe not found", async () => {
    (getMembreById as jest.Mock).mockResolvedValue(null);
    await expect(MembreEquipeClass.readId(999)).rejects.toThrow("Membre not found");
  });

  it("should load data into MembreEquipeClass instance", async () => {
    const membre = new MembreEquipeClass(mockMembre);
    (getMembreById as jest.Mock).mockResolvedValue(mockMembre);
    await membre.load();
    expect(membre.getCarteIdentite()).toBe("12345ABC");
    expect(membre.getRoleEquipe()).toBe("Admin");
  });

  it("should create a new MembreEquipe", async () => {
    (createMembre as jest.Mock).mockResolvedValue(mockMembre);
    const membre = new MembreEquipeClass(mockMembre);
    await membre.create();
    expect(createMembre).toHaveBeenCalledWith(membre);
  });

  it("should update an existing MembreEquipe", async () => {
    (updateMembre as jest.Mock).mockResolvedValue(true);
    const membre = new MembreEquipeClass(mockMembre);
    await membre.update();
    expect(updateMembre).toHaveBeenCalledWith(membre);
  });

  it("should delete a MembreEquipe by ID", async () => {
    (deleteMembre as jest.Mock).mockResolvedValue(true);
    const membre = new MembreEquipeClass(mockMembre);
    await membre.deleteId(1);
    expect(deleteMembre).toHaveBeenCalledWith(1);
  });

  it("should throw an error when deleting a non-existent MembreEquipe", async () => {
    (deleteMembre as jest.Mock).mockRejectedValue(new Error("Membre does not exist"));
    const membre = new MembreEquipeClass(mockMembre);
    await expect(membre.deleteId(999)).rejects.toThrow("Membre does not exist");
  });

  it("should retrieve all MembreEquipe data as an object", () => {
    const membre = new MembreEquipeClass(mockMembre);
    const membreData = membre.getMembre();
    expect(membreData).toEqual(mockMembre);
  });
});
