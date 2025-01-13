import { ProfilType } from "@/types"; // Assurez-vous que le type Profile est correctement importé
import { getProfilById, updateProfil, createProfil, deleteProfil } from "@/utils/dao/ProfilUtils";

export class Profil {
  private id_profil: UUID;
  private username: string;
  private updated_at: string | null;
  private email: string;
  private birthday: string | null;
  private email_confirm: boolean;
  private nom: string;
  private prenom: string;
  private adresse: string;
  private ville: string;
  private code_postal: string;
  private stripe_id: string | null;
  private plan: string;

  constructor(profile: ProfilType) {
    this.id_profil = profile.id;
    this.username = profile.username ?? "anonyme";
    this.updated_at = profile.updated_at ?? null;
    this.email = profile.email;
    this.birthday = profile.birthday ?? null;
    this.email_confirm = profile.email_confirm ?? false;
    this.nom = profile.nom ?? "Non spécifié";
    this.prenom = profile.prenom ?? "Non spécifié";
    this.adresse = profile.adresse ?? "Non spécifiée";
    this.ville = profile.ville ?? "Non spécifiée";
    this.code_postal = profile.code_postal ?? "Non spécifié";
    this.stripe_id = profile.stripe_id ?? null;
    this.plan = profile.plan ?? "none";
  }

  // Getters
  public getId(): string {
    return this.id_profil;
  }

  public getUsername(): string {
    return this.username;
  }

  public getUpdatedAt(): string | null {
    return this.updated_at;
  }

  public getEmail(): string {
    return this.email;
  }

  public getBirthday(): string | null {
    return this.birthday;
  }

  public getEmailConfirm(): boolean {
    return this.email_confirm;
  }

  public getNom(): string {
    return this.nom;
  }

  public getPrenom(): string {
    return this.prenom;
  }

  public getAdresse(): string {
    return this.adresse;
  }

  public getVille(): string {
    return this.ville;
  }

  public getCodePostal(): string {
    return this.code_postal;
  }

  public getStripeId(): string | null {
    return this.stripe_id;
  }

  public getPlan(): string {
    return this.plan;
  }

  // Setters
  public setUsername(username: string): void {
    this.username = username;
  }

  public setUpdatedAt(updated_at: string | null): void {
    this.updated_at = updated_at;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setBirthday(birthday: string | null): void {
    this.birthday = birthday;
  }

  public setEmailConfirm(email_confirm: boolean): void {
    this.email_confirm = email_confirm;
  }

  public setNom(nom: string): void {
    this.nom = nom;
  }

  public setPrenom(prenom: string): void {
    this.prenom = prenom;
  }

  public setAdresse(adresse: string): void {
    this.adresse = adresse;
  }

  public setVille(ville: string): void {
    this.ville = ville;
  }

  public setCodePostal(code_postal: string): void {
    this.code_postal = code_postal;
  }

  public setStripeId(stripe_id: string | null): void {
    this.stripe_id = stripe_id;
  }

  public setPlan(plan: string): void {
    this.plan = plan;
  }

  // Méthode pour récupérer les données du profil sous forme d'objet
  public getProfile(): ProfilType {
    return {
      id: this.id_profil,
      username: this.username,
      updated_at: this.updated_at,
      email: this.email,
      birthday: this.birthday,
      email_confirm: this.email_confirm,
      nom: this.nom,
      prenom: this.prenom,
      adresse: this.adresse,
      ville: this.ville,
      code_postal: this.code_postal,
      stripe_id: this.stripe_id,
      plan: this.plan,
    };
  }

  public static async readId(id: string): Promise<any> {
    const profile = await getProfilById(id) as any;

    if (profile == null) {
      throw new Error("Profil introuvable");
    }

    console.log("Profil après appel API dans read", profile); 

    return new Profil(profile);
  }

  public async read(): Promise<any> {
              if (!this.id_profil) {
                  throw new Error('ID is required');
              }
          
              const avis = await getProfilById(this.id_profil) as any
          
              if (!avis) {
                  throw new Error('Profil not found');
              }
          
              return new Profil(avis);
            }
          
            public async load(): Promise<void> {
              if (!this.id_profil) {
                  throw new Error('Profil ID is required');
              }
          
              const avis = await getProfilById(this.id_profil) as any
          
              if (!avis) {
                  throw new Error('Profil not found');
              }
          
              this.id_profil = avis.id;
              this.username = avis.username;
              this.updated_at = avis.updated_at;
              this.email = avis.email;
              this.birthday = avis.birthday;
              this.email_confirm = avis.email_confirm;
              this.nom = avis.nom;
              this.prenom = avis.prenom;
              this.adresse = avis.adresse;
              this.ville = avis.ville;
              this.code_postal = avis.code_postal;
              this.stripe_id = avis.stripe_id;
              this.plan = avis.plan;
            }
            
            public async create(): Promise<void> {
              const avis = await createProfil(this) as any
          
              if (!avis) {
                  throw new Error('Profil not created');
              }
            }
          
            public async deleteId(id: string): Promise<void> {
              try {
                await deleteProfil(id);
              } catch (error) {
                  throw new Error('Profil does not exist');
              }
            }
          
            public async delete(): Promise<void> {
              if (!this.id_profil) {
                console.log("Pas d'id");
                throw new Error('id is required');
              }
              try {
                await deleteProfil(this.id_profil);
              } catch (error) {
                  throw new Error('Profil does not exist');
              }
            }
          
            public async update(): Promise<void> {
              try {
                await updateProfil(this);
              } catch (error) {
                  throw new Error('Profil does not exist');
              }
            }
}
