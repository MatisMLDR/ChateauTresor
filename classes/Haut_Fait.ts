import { Haut_FaitType } from "@/types";

import { getAllHaut_Faits, getHaut_FaitById } from '@/utils/dao/Haut_FaitUtils';

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

    public async read(id_haut_fait: number): Promise<void> {
        const haut_fait = await getHaut_FaitById(id_haut_fait);
        const row = haut_fait[0];
        this.id_haut_fait = row.id_haut_fait;
        this.titre = row.titre;
        this.description = row.description;
        this.condition = row.condition;
        this.image_badge = row.image_badge;
        this.date = row.date;
    }
}

export default Haut_Fait;
