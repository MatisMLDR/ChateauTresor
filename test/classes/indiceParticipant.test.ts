import { IndiceParticipant } from '@/classes/IndiceParticipant'; // Ajustez le chemin d'importation
import { UUID } from "crypto";

// Mock de fetch pour simuler les appels API
global.fetch = jest.fn();

describe('IndiceParticipant', () => {
  describe('checkIfIndiceExists', () => {
    const participantId: UUID = '123e4567-e89b-12d3-a456-426614174000';
    const indiceId: UUID = '123e4567-e89b-12d3-a456-426614174001';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return true if the indice exists for the participant', async () => {
      // Simuler une réponse API réussie avec exists: true
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ exists: true }),
      });

      const result = await IndiceParticipant.checkIfIndiceExists(participantId, indiceId);
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participant/discovered?participantId=${participantId}&idIndice=${indiceId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return false if the indice does not exist for the participant', async () => {
      // Simuler une réponse API réussie avec exists: false
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ exists: false }),
      });

      const result = await IndiceParticipant.checkIfIndiceExists(participantId, indiceId);
      expect(result).toBe(false);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participant/discovered?participantId=${participantId}&idIndice=${indiceId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should throw an error if the API call fails', async () => {
      // Simuler une réponse API en erreur
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Erreur API' }),
      });

      await expect(IndiceParticipant.checkIfIndiceExists(participantId, indiceId)).rejects.toThrow(
        'Erreur lors de la vérification de l\'indice'
      );
    });

    it('should throw an error if the fetch call fails', async () => {
      // Simuler une erreur de fetch
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Erreur réseau'));

      await expect(IndiceParticipant.checkIfIndiceExists(participantId, indiceId)).rejects.toThrow(
        'Erreur réseau'
      );
    });
  });
});