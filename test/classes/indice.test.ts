import Indice from "@/classes/Indice";
import { IndiceType, TypeIndice } from "@/types";
import { getIndiceById, createIndice, deleteIndice, updateIndice } from "@/utils/dao/IndiceUtils";

jest.mock('@/utils/dao/IndiceUtils');

describe("Indice Class", () => {
  const mockIndice: IndiceType = {
    id_indice: "ab5f8b98-1544-402a-b333-d06bfe6f9465",
    type: "text" as TypeIndice, // ou le type que vous utilisez dans votre application
    contenu: "Ceci est un indice",
    degre_aide: 3,
    ordre: 2,
    id_enigme: "9d987c89-e37e-4ff6-ac93-ed498721d319",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of Indice", () => {
    const indice = new Indice(mockIndice as any);
    expect(indice.getId()).toBe("ab5f8b98-1544-402a-b333-d06bfe6f9465");
    expect(indice.getType()).toBe("text");
    expect(indice.getContenu()).toBe("Ceci est un indice");
    expect(indice.getDegreAide()).toBe(3);
    expect(indice.getOrdre()).toBe(2);
    expect(indice.getIdEnigme()).toBe("9d987c89-e37e-4ff6-ac93-ed498721d319");
  });

  it("should read an Indice by ID", async () => {
    (getIndiceById as jest.Mock).mockResolvedValue(mockIndice);
    const indice = await Indice.readId("ab5f8b98-1544-402a-b333-d06bfe6f9465");
    expect(indice.getId()).toBe("ab5f8b98-1544-402a-b333-d06bfe6f9465");
    expect(getIndiceById).toHaveBeenCalledWith("ab5f8b98-1544-402a-b333-d06bfe6f9465");
  });

  it("should throw an error if Indice not found", async () => {
    (getIndiceById as jest.Mock).mockResolvedValue(null);
    await expect(Indice.readId("ab5f8b98-1544-402a-b333-d06bfe6f9464")).rejects.toThrow("La chasse n'existe pas");
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
    await new Indice(mockIndice).deleteId("ab5f8b98-1544-402a-b333-d06bfe6f9465");
    expect(deleteIndice).toHaveBeenCalledWith("ab5f8b98-1544-402a-b333-d06bfe6f9465");
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
