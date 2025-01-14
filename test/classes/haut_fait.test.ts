import Haut_Fait from "@/classes/Haut_Fait";
import { createHaut_Fait, deleteHaut_Fait, getHaut_FaitById, updateHaut_Fait } from "@/utils/dao/Haut_FaitUtils";
import { Haut_FaitType } from "@/types";

jest.mock('@/utils/dao/Haut_FaitUtils');

describe("Haut_Fait Class", () => {
  const mockHautFait: Haut_FaitType = {
    id_haut_fait: "ac774612-a00d-4a17-a015-7134812ffebf",
    titre: "Explorateur des mondes",
    description: "Découvrez tous les lieux cachés.",
    condition: "Découvrir 100 lieux",
    image_badge: "explorer_badge.png",
    date: "2025-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of Haut_Fait", () => {
    const hautFait = new Haut_Fait(mockHautFait);
    expect(hautFait.getIdHaut_Fait()).toBe("ac774612-a00d-4a17-a015-7134812ffebf");
    expect(hautFait.getTitre()).toBe("Explorateur des mondes");
    expect(hautFait.getDescription()).toBe("Découvrez tous les lieux cachés.");
  });

  it("should read a Haut_Fait by ID", async () => {
    (getHaut_FaitById as jest.Mock).mockResolvedValue(mockHautFait);
    const hautFait = await Haut_Fait.readId("ac774612-a00d-4a17-a015-7134812ffebf");
    expect(hautFait.getIdHaut_Fait()).toBe("ac774612-a00d-4a17-a015-7134812ffebf");
    expect(getHaut_FaitById).toHaveBeenCalledWith("ac774612-a00d-4a17-a015-7134812ffebf");
  });

  it("should throw an error if Haut_Fait not found", async () => {
    (getHaut_FaitById as jest.Mock).mockResolvedValue(null);
    await expect(Haut_Fait.readId("ac774612-a00d-4a17-a015-7134812ffebc")).rejects.toThrow("Haut_Fait not found");
  });

  it("should create a new Haut_Fait", async () => {
    (createHaut_Fait as jest.Mock).mockResolvedValue(mockHautFait);
    const hautFait = new Haut_Fait(mockHautFait);
    await hautFait.create();
    expect(createHaut_Fait).toHaveBeenCalledWith(hautFait);
  });

  it("should update an existing Haut_Fait", async () => {
    const hautFait = new Haut_Fait(mockHautFait);
    (updateHaut_Fait as jest.Mock).mockResolvedValue(true);
    await hautFait.update();
    expect(updateHaut_Fait).toHaveBeenCalledWith(hautFait);
  });

  it("should delete a Haut_Fait by ID", async () => {
    (deleteHaut_Fait as jest.Mock).mockResolvedValue(true); // Mock successful deletion
    (getHaut_FaitById as jest.Mock).mockResolvedValue(mockHautFait); // Mock the Haut_Fait retrieval
    
    const hautFait = await Haut_Fait.readId("ac774612-a00d-4a17-a015-7134812ffebf"); // Fetch the instance
    await hautFait.delete(); // Call the delete method
    
    expect(deleteHaut_Fait).toHaveBeenCalledWith("ac774612-a00d-4a17-a015-7134812ffebf"); // Assert the delete was called with the correct ID
  });

  it("should throw an error when trying to delete a non-existent Haut_Fait", async () => {
    const hautFait = new Haut_Fait(mockHautFait);
    (deleteHaut_Fait as jest.Mock).mockRejectedValue(new Error("Haut_Fait does not exist"));
    await expect(hautFait.delete()).rejects.toThrow("Haut_Fait does not exist");
  });

  it("should load Haut_Fait data", async () => {
    const hautFait = new Haut_Fait(mockHautFait);
    (getHaut_FaitById as jest.Mock).mockResolvedValue(mockHautFait);
    await hautFait.load();
    expect(hautFait.getTitre()).toBe("Explorateur des mondes");
    expect(hautFait.getDate()).toBe("2025-01-01");
  });
});
