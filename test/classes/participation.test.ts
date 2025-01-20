// participationDAO.test.ts
import {
  getParticipationsByParticipantId,
  createParticipation,
  updateParticipation,
  deleteParticipation,
} from '@/utils/dao/ParticipationUtils'; // Assurez-vous que le chemin est correct

// Mock de fetch
global.fetch = jest.fn() as jest.Mock;

describe('Participation DAO', () => {
  const mockParticipantId = '123e4567-e89b-12d3-a456-426614174000';
  const mockChasseId = '987e6543-e21b-12d3-a456-426614174000';
  const mockParticipation = {
    id_participant: mockParticipantId,
    id_chasse: mockChasseId,
    jour: '2023-10-15',
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  // Test pour getParticipationsByParticipantId
  describe('getParticipationsByParticipantId', () => {
    it('devrait retourner les participations d\'un participant', async () => {
      const mockData = [{ ...mockParticipation }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await getParticipationsByParticipantId(mockParticipantId);
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participation?id_participant=${mockParticipantId}`
      );
    });

    it('devrait lancer une erreur si la requête échoue', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getParticipationsByParticipantId(mockParticipantId)).rejects.toThrow(
        'Erreur lors de la récupération des participations'
      );
    });
  });

  // Test pour createParticipation
  describe('createParticipation', () => {
    it('devrait créer une nouvelle participation', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockParticipation),
      });

      const result = await createParticipation(mockParticipation);
      expect(result).toEqual(mockParticipation);
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockParticipation),
      });
    });

    it('devrait lancer une erreur si la création échoue', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(createParticipation(mockParticipation)).rejects.toThrow(
        'Erreur lors de la création de la participation'
      );
    });
  });

  // Test pour updateParticipation
  describe('updateParticipation', () => {
    it('devrait mettre à jour une participation', async () => {
      const updatedData = { ...mockParticipation, statut: 'confirmé' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedData),
      });

      const result = await updateParticipation(updatedData);
      expect(result).toEqual(updatedData);
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
    });

    it('devrait lancer une erreur si la mise à jour échoue', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(updateParticipation(mockParticipation)).rejects.toThrow(
        `Erreur lors de la mise à jour de la participation pour le participant ${mockParticipantId} et la chasse ${mockChasseId}`
      );
    });
  });

  // Test pour deleteParticipation
  describe('deleteParticipation', () => {
    it('devrait supprimer une participation', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await deleteParticipation(mockParticipantId, mockChasseId);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participation?id_participant=${mockParticipantId}&id_chasse=${mockChasseId}`,
        {
          method: 'DELETE',
        }
      );
    });

    it('devrait lancer une erreur si la suppression échoue', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(deleteParticipation(mockParticipantId, mockChasseId)).rejects.toThrow(
        `Erreur lors de la suppression de la participation pour le participant ${mockParticipantId} et la chasse ${mockChasseId}`
      );
    });
  });
});