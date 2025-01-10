import { RecompenseType } from "@/types";
import { createRecompense, deleteRecompense, getRecompenseById, updateRecompense } from '@/utils/dao/RecompenseUtils';

class Recompense {
    private id_recompense: number;
    private nom: string;
    private description: string;
    private type: string;
    private valeur: number;
    private quantite_dispo: number;
    private prix_reel: number;
    private image: string | null;
    private date_modification: string;
    private id_chasse: number | null;

    constructor(recompense: RecompenseType) {
        this.id_recompense = recompense.id_recompense;
        this.nom = recompense.nom;
        this.description = recompense.description;
        this.type = recompense.type;
        this.valeur = recompense.valeur;
        this.quantite_dispo = recompense.quantite_dispo;
        this.prix_reel = recompense.prix_reel;
        this.image = recompense.image;
        this.date_modification = recompense.date_modification;
        this.id_chasse = recompense.id_chasse;
    }

    public getIdRecompense(): number {
        return this.id_recompense;
    }

    public getNom(): string {
        return this.nom;
    }

    public getDescription(): string {
        return this.description;
    }

    public getType(): string {
        return this.type;
    }

    public getValeur(): number {
        return this.valeur;
    }

    public getQuantiteDispo(): number {
        return this.quantite_dispo;
    }

    public getPrixReel(): number {
        return this.prix_reel;
    }

    public getImage(): string | null {
        return this.image;
    }

    public getDateModification(): string {
        return this.date_modification;
    }

    public getIdChasse(): number | null {
        return this.id_chasse;
    }

    public setIdRecompense(id_recompense: number): void {
        this.id_recompense = id_recompense;
    }

    public setNom(nom: string): void {
        this.nom = nom;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public setValeur(valeur: number): void {
        this.valeur = valeur;
    }

    public setQuantiteDispo(quantite_dispo: number): void {
        this.quantite_dispo = quantite_dispo;
    }

    public setPrixReel(prix_reel: number): void {
        this.prix_reel = prix_reel;
    }

    public setImage(image: string): void {
        this.image = image;
    }

    public setDateModification(date_modification: string): void {
        this.date_modification = date_modification;
    }

    public setIdChasse(id_chasse: number): void {
        this.id_chasse = id_chasse;
    }

    public static async readId(id_recompense: number): Promise<any> {
        const recompense = await getRecompenseById(id_recompense) as any;

        if (!recompense) {
            throw new Error('Recompense not found');
        }

        console.log("Recompense après appel API dans read", recompense); 

        return new Recompense(recompense);
    }

    public async read(): Promise<any> {
                if (!this.id_recompense) {
                    throw new Error('Recompense ID is required');
                }
            
                const avis = await getRecompenseById(this.id_recompense) as any
            
                if (!avis) {
                    throw new Error('Recompense not found');
                }
            
                return new Recompense(avis);
              }
            
              public async load(): Promise<void> {
                if (!this.id_recompense) {
                    throw new Error('Recompense ID is required');
                }
            
                const avis = await getRecompenseById(this.id_recompense) as any
            
                if (!avis) {
                    throw new Error('Recompense not found');
                }
            
                this.id_recompense = avis.id_recompense;
                this.nom = avis.nom;
                this.description = avis.description;
                this.type = avis.type;
                this.valeur = avis.valeur;
                this.quantite_dispo = avis.quantite_dispo;
                this.prix_reel = avis.prix_reel;
                this.image = avis.image;
                this.date_modification = avis.date_modification;
                this.id_chasse = avis.id_chasse;
              }
              
              public async create(): Promise<void> {
                const avis = await createRecompense(this) as any
            
                if (!avis) {
                    throw new Error('Recompense not created');
                }
              }
            
              public async deleteId(id_recompense: number): Promise<void> {
                try {
                  await deleteRecompense(id_recompense);
                } catch (error) {
                    throw new Error('Recompense does not exist');
                }
              }
            
              public async delete(): Promise<void> {
                if (!this.id_recompense) {
                  console.log("Pas d'id Recompense");
                  throw new Error('id_recompense is required');
                }
                try {
                  await deleteRecompense(this.id_recompense);
                } catch (error) {
                    throw new Error('Recompense does not exist');
                }
              }
            
              public async update(): Promise<void> {
                try {
                  await updateRecompense(this);
                } catch (error) {
                    throw new Error('Recompense does not exist');
                }
              }
} 

export default Recompense;