import { UUID } from "crypto";
import { indiceDecouvert, updateIndiceParticipant, deleteIndiceParticipant, checkIfIndiceExists } from "@/utils/dao/IndiceParticipantUtils";

export class IndiceParticipant {
  id_indice: UUID;
  id_participant: UUID;
  est_decouvert: boolean;
  date_utilisation: Date;

  constructor(data: { id_indice: UUID; id_participant: UUID; est_decouvert?: boolean; date_utilisation?: Date }) {
    this.id_indice = data.id_indice;
    this.id_participant = data.id_participant;
    this.est_decouvert = data.est_decouvert || false;
    this.date_utilisation = data.date_utilisation || new Date();
  }

  // Getters
  public getIdIndice(): UUID {
    return this.id_indice;
  }

  public getIdParticipant(): UUID {
    return this.id_participant;
  }

  public getEstDecouvert(): boolean {
    return this.est_decouvert;
  }

  public getDateUtilisation(): Date {
    return this.date_utilisation;
  }

  // Setters
  public setIdIndice(id_indice: UUID): void {
    this.id_indice = id_indice;
  }

  public setIdParticipant(id_participant: UUID): void {
    this.id_participant = id_participant;
  }

  public setEstDecouvert(est_decouvert: boolean): void {
    this.est_decouvert = est_decouvert;
  }

  public setDateUtilisation(date_utilisation: Date): void {
    this.date_utilisation = date_utilisation;
  }

  /**
   * Méthode pour marquer un indice comme découvert par un participant
   * @returns Promise<void>
   * @throws Error si l'opération échoue
   */
  public async markAsDiscovered(): Promise<void> {
    try {
      // Appeler la méthode du DAO pour enregistrer l'indice comme découvert
      const result = await indiceDecouvert(this.id_indice, this.id_participant);

      // Mettre à jour les propriétés de l'objet
      this.est_decouvert = true;
      this.date_utilisation = new Date();

      // Log du résultat
      console.log("Indice marqué comme découvert avec succès:", result);
    } catch (error) {
      console.error("Erreur dans markAsDiscovered:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue lors de l'enregistrement de l'indice"
      );
    }
  }

  /**
   * Méthode pour mettre à jour un enregistrement Indice_Participant
   * @returns Promise<void>
   * @throws Error si la mise à jour échoue
   */
  public async update(): Promise<void> {
    try {
      await updateIndiceParticipant(this.id_indice, this.id_participant, {
        est_decouvert: this.est_decouvert,
        date_utilisation: this.date_utilisation.toISOString(),
      });
    } catch (error) {
      console.error("Erreur dans update:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue lors de la mise à jour de l'enregistrement"
      );
    }
  }

  /**
   * Méthode pour supprimer un enregistrement Indice_Participant
   * @returns Promise<void>
   * @throws Error si la suppression échoue
   */
  public async delete(): Promise<void> {
    try {
      await deleteIndiceParticipant(this.id_indice, this.id_participant);
    } catch (error) {
      console.error("Erreur dans delete:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue lors de la suppression de l'enregistrement"
      );
    }
  }

  /**
   * Méthode pour charger les données d'un enregistrement Indice_Participant
   * @returns Promise<IndiceParticipant>
   * @throws Error si l'enregistrement n'existe pas
   */
  public static async read(id_indice: UUID, id_participant: UUID): Promise<IndiceParticipant> {
    try {
      // Simuler une récupération depuis l'API ou la base de données
      const data = { id_indice, id_participant, est_decouvert: true, date_utilisation: new Date() };
      return new IndiceParticipant(data);
    } catch (error) {
      console.error("Erreur dans read:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue lors de la récupération de l'enregistrement"
      );
    }
  }

  /**
   * Méthode pour récupérer les indices révélés par un participant
   * @param participantId L'identifiant du participant
   * @returns Promise<IndiceParticipant[]> La liste des indices révélés
   * @throws Error si l'opération échoue
   */
  public static async getDiscoveredIndices(participantId: UUID): Promise<IndiceParticipant[]> {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participant/discovered?participantId=${participantId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error('Erreur API:', res.status, errorResponse);
        throw new Error(errorResponse.error || 'Erreur lors de la récupération des indices révélés');
      }

      const data = await res.json();
      return data.map((item: any) => new IndiceParticipant(item));
    } catch (error) {
      console.error('Erreur dans getDiscoveredIndices:', error);
      throw error;
    }
  }


  public static async checkIfIndiceExists(
    participantId: UUID,
    indiceId: UUID
  ): Promise<boolean> {
    // Appel direct au DAO sans logique supplémentaire
    return checkIfIndiceExists(participantId, indiceId);
  }

}