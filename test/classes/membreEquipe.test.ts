import { MembreEquipe } from "@/classes/MembreEquipe";
import { MembreEquipeType } from "@/types";
import { createMembre, deleteMembre, getMembreById, updateMembre } from "@/utils/dao/MembreEquipeUtils";

jest.mock("@/utils/dao/MembreEquipeUtils");

describe("MembreEquipe", () => {
  const mockMembre: MembreEquipeType = {
    id_membre: "8545523b-af23-4ed0-9be9-b3a09f52aec0",
    id_user: "24a83015-32e1-49a5-a6a9-e16fa417c67f",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of MembreEquipe", () => {
    const membre = new MembreEquipe(mockMembre);
    expect(membre.getIdMembre()).toBe("8545523b-af23-4ed0-9be9-b3a09f52aec0");
    expect(membre.getIdUser()).toBe("24a83015-32e1-49a5-a6a9-e16fa417c67f");
  });

  it("should retrieve a MembreEquipe by ID", async () => {
    (getMembreById as jest.Mock).mockResolvedValue(mockMembre);
    const membre = await MembreEquipe.readId("8545523b-af23-4ed0-9be9-b3a09f52aec0");
    expect(membre.getIdMembre()).toBe("8545523b-af23-4ed0-9be9-b3a09f52aec0");
    expect(getMembreById).toHaveBeenCalledWith("8545523b-af23-4ed0-9be9-b3a09f52aec0");
  });

  it("should throw an error if MembreEquipe not found", async () => {
    (getMembreById as jest.Mock).mockResolvedValue(null);
    await expect(MembreEquipe.readId("8545523b-af23-4ed0-9be9-b3a09f52aec1")).rejects.toThrow("Membre not found");
  });

  it("should load data into MembreEquipe instance", async () => {
    const membre = new MembreEquipe(mockMembre);
    (getMembreById as jest.Mock).mockResolvedValue(mockMembre);
    await membre.load();
  });

  it("should create a new MembreEquipe", async () => {
    (createMembre as jest.Mock).mockResolvedValue(mockMembre);
    const membre = new MembreEquipe(mockMembre);
    await membre.create();
    expect(createMembre).toHaveBeenCalledWith(membre);
  });

  it("should update an existing MembreEquipe", async () => {
    (updateMembre as jest.Mock).mockResolvedValue(true);
    const membre = new MembreEquipe(mockMembre);
    await membre.update();
    expect(updateMembre).toHaveBeenCalledWith(membre);
  });

  it("should delete a MembreEquipe by ID", async () => {
    (deleteMembre as jest.Mock).mockResolvedValue(true);
    const membre = new MembreEquipe(mockMembre);
    await membre.deleteId("8545523b-af23-4ed0-9be9-b3a09f52aec0");
    expect(deleteMembre).toHaveBeenCalledWith("8545523b-af23-4ed0-9be9-b3a09f52aec0");
  });

  it("should throw an error when deleting a non-existent MembreEquipe", async () => {
    (deleteMembre as jest.Mock).mockRejectedValue(new Error("Membre does not exist"));
    const membre = new MembreEquipe(mockMembre);
    await expect(membre.deleteId("8545523b-af23-4ed0-9be9-b3a09f52aec1")).rejects.toThrow("Membre does not exist");
  });

  it("should retrieve all MembreEquipe data as an object", () => {
    const membre = new MembreEquipe(mockMembre);
    const membreData = membre.getMembre();
    expect(membreData).toEqual(mockMembre);
  });
});
