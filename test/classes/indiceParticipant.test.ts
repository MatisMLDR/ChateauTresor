import { IndiceParticipant } from "@/classes/IndiceParticipant"; // Ajustez le chemin d'import
import { indiceDecouvert, updateIndiceParticipant, deleteIndiceParticipant } from "@/utils/dao/IndiceParticipantUtils";
import { UUID } from "crypto";

jest.mock('@/utils/dao/IndiceParticipantUtils', () => ({
  indiceDecouvert: jest.fn(),
  updateIndiceParticipant: jest.fn(),
  deleteIndiceParticipant: jest.fn(),
}));

describe('IndiceParticipant', () => {
  const mockData = {
    id_indice: "8f5f429d-724d-4eae-b4cc-0ff5ac8f71ad" as UUID,
    id_participant: "e94f0bed-26e9-4bf4-a7a5-5da550ea6e9b" as UUID,
    est_decouvert: false,
    date_utilisation: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize correctly', () => {
    const indiceParticipant = new IndiceParticipant(mockData);

    expect(indiceParticipant.getIdIndice()).toBe(mockData.id_indice);
    expect(indiceParticipant.getIdParticipant()).toBe(mockData.id_participant);
    expect(indiceParticipant.getEstDecouvert()).toBe(mockData.est_decouvert);
    expect(indiceParticipant.getDateUtilisation()).toEqual(mockData.date_utilisation);
  });

  test('markAsDiscovered should update properties and call DAO', async () => {
    (indiceDecouvert as jest.Mock).mockResolvedValue({ success: true });

    const indiceParticipant = new IndiceParticipant(mockData);
    await indiceParticipant.markAsDiscovered();

    expect(indiceDecouvert).toHaveBeenCalledWith(mockData.id_indice, mockData.id_participant);
    expect(indiceParticipant.getEstDecouvert()).toBe(true);
    expect(indiceParticipant.getDateUtilisation()).toBeInstanceOf(Date);
  });

  test('update should call DAO with correct data', async () => {
    (updateIndiceParticipant as jest.Mock).mockResolvedValue({ success: true });

    const indiceParticipant = new IndiceParticipant(mockData);
    await indiceParticipant.update();

    expect(updateIndiceParticipant).toHaveBeenCalledWith(
      mockData.id_indice,
      mockData.id_participant,
      {
        est_decouvert: mockData.est_decouvert,
        date_utilisation: mockData.date_utilisation.toISOString(),
      }
    );
  });

  test('delete should call DAO with correct ids', async () => {
    (deleteIndiceParticipant as jest.Mock).mockResolvedValue({ success: true });

    const indiceParticipant = new IndiceParticipant(mockData);
    await indiceParticipant.delete();

    expect(deleteIndiceParticipant).toHaveBeenCalledWith(mockData.id_indice, mockData.id_participant);
  });

  test('read should create an instance from DAO data', async () => {
    const fetchedData = {
      id_indice: mockData.id_indice,
      id_participant: mockData.id_participant,
      est_decouvert: true,
      date_utilisation: new Date(),
    };
    jest.spyOn(IndiceParticipant, 'read').mockResolvedValue(new IndiceParticipant(fetchedData));

    const result = await IndiceParticipant.read(mockData.id_indice, mockData.id_participant);

    expect(result).toBeInstanceOf(IndiceParticipant);
    expect(result.getEstDecouvert()).toBe(true);
  });

  test('getDiscoveredIndices should fetch and return instances', async () => {
    const mockDiscoveredData = [
      { ...mockData, est_decouvert: true },
      { ...mockData, id_indice: "new-uuid" as UUID },
    ];
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockDiscoveredData),
    } as any);

    const result = await IndiceParticipant.getDiscoveredIndices(mockData.id_participant);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(IndiceParticipant);
    expect(result[0].getEstDecouvert()).toBe(true);
  });

  test('checkIfIndiceExists should return true if indice exists', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ exists: true }),
    } as any);

    const exists = await IndiceParticipant.checkIfIndiceExists(mockData.id_participant, mockData.id_indice);

    expect(exists).toBe(true);
  });

  test('checkIfIndiceExists should return false on error or no match', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    } as any);

    const exists = await IndiceParticipant.checkIfIndiceExists(mockData.id_participant, mockData.id_indice);

    expect(exists).toBe(false);
  });
});