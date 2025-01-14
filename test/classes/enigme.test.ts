import { Enigme } from "@/classes/Enigme"; // Ajustez le chemin d'import
import { 
  getEnigmeById, 
  createEnigme, 
  deleteEnigme, 
  updateEnigme, 
  getAllEnigmesParticipants, 
} from "@/utils/dao/EnigmeUtils";
import { getAllIndicesParticipants } from "@/utils/dao/IndiceUtils";
import { EnigmeType } from "@/types";

jest.mock("@/utils/dao/EnigmeUtils", () => ({
  getEnigmeById: jest.fn(),
  createEnigme: jest.fn(),
  deleteEnigme: jest.fn(),
  updateEnigme: jest.fn(),
  getAllEnigmesParticipants: jest.fn(),
}));

jest.mock("@/utils/dao/IndiceUtils", () => ({
  getAllIndicesParticipants: jest.fn(),
}));

describe("Enigme", () => {
  const mockEnigmeData: EnigmeType = {
    id_enigme: "15da4f27-e009-40a9-9a65-bcf31de85640",
    id_chasse: "f764ff5d-426f-4c6e-818f-46bfe510f544",
    titre: "Une énigme intéressante",
    indices: [],
    code_reponse: "Code secret",
    ordre: 1,
    description: "Description de l'énigme",
    endroit_qrcode: "Endroit secret",
    temps_max: 300,
    description_reponse: "Réponse détaillée",
    degre_difficulte: 3,
    image_reponse: "image_url",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize correctly", () => {
    const enigme = new Enigme(mockEnigmeData);

    expect(enigme.getId()).toBe(mockEnigmeData.id_enigme);
    expect(enigme.getIdChasse()).toBe(mockEnigmeData.id_chasse);
    expect(enigme.getTitre()).toBe(mockEnigmeData.titre);
    expect(enigme.getCode_reponse()).toBe(mockEnigmeData.code_reponse);
    expect(enigme.getOrdre()).toBe(mockEnigmeData.ordre);
    expect(enigme.getDescription()).toBe(mockEnigmeData.description);
    expect(enigme.getEndroitQrCode()).toBe(mockEnigmeData.endroit_qrcode);
    expect(enigme.getTempsMax()).toBe(mockEnigmeData.temps_max);
    expect(enigme.getDescriptionReponse()).toBe(mockEnigmeData.description_reponse);
    expect(enigme.getDegreDifficulte()).toBe(mockEnigmeData.degre_difficulte);
    expect(enigme.getImageReponse()).toBe(mockEnigmeData.image_reponse);
  });

  test("readId should fetch and return a new Enigme instance", async () => {
    (getEnigmeById as jest.Mock).mockResolvedValue(mockEnigmeData);

    const enigme = await Enigme.readId("15da4f27-e009-40a9-9a65-bcf31de85640");

    expect(getEnigmeById).toHaveBeenCalledWith("15da4f27-e009-40a9-9a65-bcf31de85640");
    expect(enigme).toBeInstanceOf(Enigme);
    expect(enigme.getId()).toBe(mockEnigmeData.id_enigme);
  });

  test("read should fetch and return a new Enigme instance", async () => {
    (getEnigmeById as jest.Mock).mockResolvedValue(mockEnigmeData);

    const enigme = new Enigme(mockEnigmeData);
    const fetchedEnigme = await enigme.read();

    expect(getEnigmeById).toHaveBeenCalledWith(mockEnigmeData.id_enigme);
    expect(fetchedEnigme).toBeInstanceOf(Enigme);
  });

  test("create should call createEnigme with correct data", async () => {
    (createEnigme as jest.Mock).mockResolvedValue(mockEnigmeData);

    const enigme = new Enigme(mockEnigmeData);
    await enigme.create();

    expect(createEnigme).toHaveBeenCalledWith(enigme);
  });

  test("deleteId should call deleteEnigme with correct id", async () => {
    (deleteEnigme as jest.Mock).mockResolvedValue(undefined);

    const enigme = new Enigme(mockEnigmeData);
    await enigme.deleteId(mockEnigmeData.id_enigme!);

    expect(deleteEnigme).toHaveBeenCalledWith(mockEnigmeData.id_enigme);
  });

  test("delete should call deleteEnigme with instance id", async () => {
    (deleteEnigme as jest.Mock).mockResolvedValue(undefined);

    const enigme = new Enigme(mockEnigmeData);
    await enigme.delete();

    expect(deleteEnigme).toHaveBeenCalledWith(mockEnigmeData.id_enigme);
  });

  test("update should call updateEnigme with correct data", async () => {
    (updateEnigme as jest.Mock).mockResolvedValue(undefined);

    const enigme = new Enigme(mockEnigmeData);
    await enigme.update();

    expect(updateEnigme).toHaveBeenCalledWith(enigme);
  });

  test("load should fetch data and update instance properties", async () => {
    (getEnigmeById as jest.Mock).mockResolvedValue({ ...mockEnigmeData, titre: "Titre mis à jour" });

    const enigme = new Enigme(mockEnigmeData);
    await enigme.load();

    expect(getEnigmeById).toHaveBeenCalledWith(mockEnigmeData.id_enigme);
    expect(enigme.getTitre()).toBe("Titre mis à jour");
  });

  test("getTempsMoyen should calculate average time", async () => {
    const mockParticipantsData = [
      { duree: 200 },
      { duree: 300 },
      { duree: 400 },
    ];
  
    (getAllEnigmesParticipants as jest.Mock).mockResolvedValue(mockParticipantsData);
  
    const enigme = new Enigme(mockEnigmeData);
    const tempsMoyen = await enigme.getTempsMoyen();
  
    expect(getAllEnigmesParticipants).toHaveBeenCalledWith(mockEnigmeData.id_enigme);
    expect(tempsMoyen).toBe(300);
  });

  test("getReussiteMoyenne should calculate success percentage", async () => {
    const mockParticipantsData = [
      { est_resolue: 1 },
      { est_resolue: 0 },
      { est_resolue: 1 },
    ];

    (getAllEnigmesParticipants as jest.Mock).mockResolvedValue(mockParticipantsData);

    const enigme = new Enigme(mockEnigmeData);
    const reussiteMoyenne = await enigme.getReussiteMoyenne();

    expect(getAllEnigmesParticipants).toHaveBeenCalledWith(mockEnigmeData.id_enigme);
    expect(reussiteMoyenne).toBe(66.66666666666666);
  });

  test("getNbIndiceRevele should calculate number of hints revealed", async () => {
    const mockIndicesData = [
      { est_decouvert: 1 },
      { est_decouvert: 0 },
      { est_decouvert: 1 },
    ];
  
    (getAllIndicesParticipants as jest.Mock).mockResolvedValue(mockIndicesData);
  
    const enigme = new Enigme(mockEnigmeData);
    const nbIndiceRevele = await enigme.getNbIndiceRevele();
  
    expect(getAllIndicesParticipants).toHaveBeenCalledWith(mockEnigmeData.id_enigme);
    expect(nbIndiceRevele).toBe(2);
  });
});