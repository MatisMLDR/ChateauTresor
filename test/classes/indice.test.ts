import Indice from "@/classes/Indice";
import { getIndiceById, createIndice, deleteIndice, updateIndice } from "@/utils/dao/IndiceUtils";

jest.mock('@/utils/dao/IndiceUtils');

describe("Indice Class", () => {
  const mockIndice = {
    id_indice: 1,
    type: "texte", // ou le type que vous utilisez dans votre application
    contenu: "Ceci est un indice",
    degre_aide: 3,
    ordre: 2,
    id_enigme: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of Indice", () => {
    const indice = new Indice(mockIndice);
    expect(indice.getId()).toBe(1);
    expect(indice.getType()).toBe("texte");
    expect(indice.getContenu()).toBe("Ceci est un indice");
    expect(indice.getDegreAide()).toBe(3);
    expect(indice.getOrdre()).toBe(2);
    expect(indice.getIdEnigme()).toBe(10);
  });

  it("should read an Indice by ID", async () => {
    (getIndiceById as jest.Mock).mockResolvedValue(mockIndice);
    const indice = await Indice.readId(1);
    expect(indice.getId()).toBe(1);
    expect(getIndiceById).toHaveBeenCalledWith(1);
  });

  it("should throw an error if Indice not found", async () => {
    (getIndiceById as jest.Mock).mockResolvedValue(null);
    await expect(Indice.readId(999)).rejects.toThrow("La chasse n'existe pas");
  });

  it("should load Indice data", async () => {
    const indice = new Indice(mockIndice);
    (getIndiceById as jest.Mock).mockResolvedValue(mockIndice);
    await indice.load();
    expect(indice.getContenu()).toBe("Ceci est un indice");
    expect(indice.getDegreAide()).toBe(3);
  });

  it("should create a new Indice", async () => {
    (createIndice as jest.Mock).mockResolvedValue(mockIndice);
    const indice = new Indice(mockIndice);
    await indice.create();
    expect(createIndice).toHaveBeenCalledWith(indice);
  });

  it("should update an Indice", async () => {
    const indice = new Indice(mockIndice);
    (updateIndice as jest.Mock).mockResolvedValue(true);
    await indice.update();
    expect(updateIndice).toHaveBeenCalledWith(indice);
  });

  it("should delete an Indice by ID", async () => {
    (deleteIndice as jest.Mock).mockResolvedValue(true);
    await new Indice(mockIndice).deleteId(1);
    expect(deleteIndice).toHaveBeenCalledWith(1);
  });

  it("should throw an error when trying to delete a non-existent Indice", async () => {
    (deleteIndice as jest.Mock).mockRejectedValue(new Error("Indice does not exist"));
    await expect(new Indice(mockIndice).delete()).rejects.toThrow("Indice does not exist");
  });

  it("should handle degre_aide bounds", () => {
    const highDegre = new Indice({ ...mockIndice, degre_aide: 10 });
    expect(highDegre.getDegreAide()).toBe(5);

    const lowDegre = new Indice({ ...mockIndice, degre_aide: -5 });
    expect(lowDegre.getDegreAide()).toBe(1);
  });
});
