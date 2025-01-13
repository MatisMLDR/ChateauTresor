import Texte from "@/classes/Texte";
import { getTexteById, createTexte, updateTexte, deleteTexte } from "@/utils/dao/TexteUtils";

jest.mock("@/utils/dao/TexteUtils");

describe("Texte Class", () => {
  const mockTexteData = {
    id_texte: 1,
    contenu: "Exemple de contenu",
    id_indice: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a Texte instance correctly", () => {
    const texte = new Texte(mockTexteData);
    expect(texte.getIdTexte()).toBe(mockTexteData.id_texte);
    expect(texte.getContenu()).toBe(mockTexteData.contenu);
    expect(texte.getIdIndice()).toBe(mockTexteData.id_indice);
  });

  it("should read a Texte by ID", async () => {
    (getTexteById as jest.Mock).mockResolvedValue(mockTexteData);

    const texte = await Texte.readId(1);
    expect(texte).toBeInstanceOf(Texte);
    expect(texte.getIdTexte()).toBe(mockTexteData.id_texte);
    expect(texte.getContenu()).toBe(mockTexteData.contenu);
    expect(getTexteById).toHaveBeenCalledWith(1);
  });

  it("should throw an error when trying to read a non-existent Texte", async () => {
    (getTexteById as jest.Mock).mockResolvedValue(null);

    await expect(Texte.readId(999)).rejects.toThrow("Texte not found");
  });

  it("should load Texte data correctly", async () => {
    (getTexteById as jest.Mock).mockResolvedValue(mockTexteData);

    const texte = new Texte({ id_texte: 1, contenu: "", id_indice: null });
    await texte.load();

    expect(texte.getContenu()).toBe(mockTexteData.contenu);
    expect(getTexteById).toHaveBeenCalledWith(1);
  });

  it("should create a new Texte", async () => {
    (createTexte as jest.Mock).mockResolvedValue(mockTexteData);

    const texte = new Texte(mockTexteData);
    await texte.create();

    expect(createTexte).toHaveBeenCalledWith(texte);
  });

  it("should update an existing Texte", async () => {
    (updateTexte as jest.Mock).mockResolvedValue(true);

    const texte = new Texte(mockTexteData);
    texte.setContenu("Nouveau contenu");
    await texte.update();

    expect(updateTexte).toHaveBeenCalledWith(texte);
  });

  it("should delete a Texte by ID", async () => {
    (deleteTexte as jest.Mock).mockResolvedValue(true);

    await new Texte(mockTexteData).deleteId(1);
    expect(deleteTexte).toHaveBeenCalledWith(1);
  });

  it("should throw an error when deleting a Texte without an ID", async () => {
    const texte = new Texte({ ...mockTexteData, id_texte: Number.NaN
     });

    await expect(texte.delete()).rejects.toThrow("id_texte is required");
  });

  it("should delete a Texte instance", async () => {
    (deleteTexte as jest.Mock).mockResolvedValue(true);

    const texte = new Texte(mockTexteData);
    await texte.delete();

    expect(deleteTexte).toHaveBeenCalledWith(mockTexteData.id_texte);
  });
});
