import { Haut_FaitType } from "@/types";

import { createHaut_Fait, deleteHaut_Fait, getAllHaut_Faits, getHaut_FaitById, updateHaut_Fait } from '@/utils/dao/Haut_FaitUtils';

class Haut_Fait {
    private id_haut_fait: number;
    private titre: string;
    private description: string;
    private condition: string;
    private image_badge: string;
    private date: string;

    constructor(haut_fait: Haut_FaitType) {
        this.id_haut_fait = haut_fait.id_haut_fait;
        this.titre = haut_fait.titre;
        this.description = haut_fait.description;
        this.condition = haut_fait.condition;
        this.image_badge = haut_fait.image_badge;
        this.date = haut_fait.date;
    }

    public getIdHaut_Fait(): number {
        return this.id_haut_fait;
    }

    public getTitre(): string {
        return this.titre;
    }

    public getDescription(): string {
        return this.description;
    }

    public getCondition(): string {
        return this.condition;
    }

    public getImageBadge(): string {
        return this.image_badge;
    }

    public getDate(): string {
        return this.date;
    }

    public setIdHaut_Fait(id_haut_fait: number): void {
        this.id_haut_fait = id_haut_fait;
    }

    public setTitre(titre: string): void {
        this.titre = titre;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setCondition(condition: string): void {
        this.condition = condition;
    }

    public setImageBadge(image_badge: string): void {
        this.image_badge = image_badge;
    }

    public setDate(date: string): void {
        this.date = date;
    }

    public async readId(id_haut_fait: number): Promise<any> {
        const haut_fait = await getHaut_FaitById(id_haut_fait) as any;

        if (!haut_fait) {
            throw new Error('Haut_Fait not found');
        }

        console.log("Haut_Fait après appel API dans read", haut_fait); 

        return new Haut_Fait(haut_fait);    
    }

    public async read(): Promise<any> {
            if (!this.id_haut_fait) {
                throw new Error('Haut_Fait ID is required');
            }
        
            const avis = await getHaut_FaitById(this.id_haut_fait) as any
        
            if (!avis) {
                throw new Error('Haut_Fait not found');
            }
        
            return new Haut_Fait(avis);
          }
        
          public async load(): Promise<void> {
            if (!this.id_haut_fait) {
                throw new Error('Haut_Fait ID is required');
            }
        
            const avis = await getHaut_FaitById(this.id_haut_fait) as any
        
            if (!avis) {
                throw new Error('Haut_fait not found');
            }
        
            this.id_haut_fait = avis.id_haut_fait;
            this.titre = avis.titre;
            this.description = avis.description;
            this.condition = avis.condition;
            this.image_badge = avis.image_badge;
            this.date = avis.date;
          }
        
          public async create(): Promise<void> {
            const avis = await createHaut_Fait(this) as any
        
            if (!avis) {
                throw new Error('Haut_Fait not created');
            }
          }
        
          public async deleteId(id_haut_fait: number): Promise<void> {
            try {
              await deleteHaut_Fait(id_haut_fait);
            } catch (error) {
                throw new Error('Haut_Fait does not exist');
            }
          }
        
          public async delete(): Promise<void> {
            if (!this.id_haut_fait) {
              console.log("Pas d'id Haut_Fait");
              throw new Error('id_Haut_Fait is required');
            }
            try {
              await deleteHaut_Fait(this.id_haut_fait);
            } catch (error) {
                throw new Error('Haut_Fait does not exist');
            }
          }
        
          public async update(): Promise<void> {
            try {
              await updateHaut_Fait(this);
            } catch (error) {
                throw new Error('Enigme does not exist');
            }
          }
}

export default Haut_Fait;
