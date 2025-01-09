import { UUID } from "crypto";

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  price: Stripe.Price;
}

export interface InputWithLabelProps {
  label: string;
  inputType: string;
  inputPlaceholder?: string;
  inputId;
  className?: string;
}

export interface SliderWithBoundsProps {
  min: number;
  max: number;
  step: number;
  className?: string;
}

export interface TitleTwoProps {
  text: string;
  color: 'light' | 'dark';
  className?: string;
}

export interface NavigationVerticaleItemsProps {
  name: string;
  link: string;
  imagePath: string;
  className?: string;
}



//// Création de chasse au trésor ////



export type IndiceType = 'image' | 'sound' | 'text';

// Indice
export type Indice = {
  id: string;
  type: IndiceType;
  contenu: string;
  degre_aide: number;
  ordre: number;
};

// Énigme
export type EnigmeType = {
  id: number;
  titre: string;
  indices: Indice[];
  qrCode: string;
  code: string;
  description: string;
  endroit_qrcode: string;
  temps_max: number;
  description_reponse: string;
  image_reponse: string;
};


///////////

export type ChasseType = {
  id_chasse: number; // Identifiant unique, SERIAL, non null
  titre?: string; // Optionnel, par défaut 'Nouvelle Chasse'
  capacite?: number; // Optionnel, par défaut 0
  description?: string; // Optionnel, par défaut 'Pas de description'
  age_requis?: number; // Optionnel, par défaut 0
  image?: string | null; // Peut être null
  date_creation?: string; // Optionnel, TIMESTAMP, par défaut CURRENT_TIMESTAMP
  date_modification?: string; // Optionnel, TIMESTAMP, par défaut CURRENT_TIMESTAMP
  date_debut?: string | null; // Peut être null, TIMESTAMP
  date_fin?: string | null; // Peut être null, TIMESTAMP
  prix?: number; // Optionnel, NUMERIC(10, 2), par défaut 0.00
  difficulte?: number; // Optionnel, entre 1 et 3, par défaut 1
  duree_estime?: string; // Optionnel, INTERVAL, par défaut '00:00:00'
  theme?: string; // Optionnel, par défaut 'Aucun thème'
  statut?: string; // Optionnel, par défaut 'Inactif'
  id_chateau?: number | null; // Peut être null, clé étrangère vers Chateau(id_chateau)
  id_equipe?: number | null; // Peut être null, clé étrangère vers Equipe_Organisatrice(id_equipe)

  chateau?: ChateauType;
  nb_enigmes: number;
  enigmes?: EnigmeType[];
};

export type ParticipantType = {
  id_participant: number;
  nom: string;
  prenom: string;
  email: string;
  id_user: string;
  adresse: string;
  ville: string;
  code_postal: string;
  birthday: string;
  plan: string;
  updated_at: string;
  stripe_id: string;
  
}

export type ChateauType = {
  id_chateau: number; // Clé primaire, identifiant du château
  nom?: string; // Nom du château, par défaut 'Château inconnu'
  adresse_postale?: string; // Adresse postale, par défaut 'Non spécifiée'
  localisation?: string; // Localisation, par défaut 'Non spécifiée'
  capacite?: number; // Capacité, par défaut 0
  prix_location?: number; // Prix de location, par défaut 0.00
  telephone?: string | null; // Numéro de téléphone, par défaut null
  description?: string; // Description, par défaut 'Pas de description'
  image?: string | null; // URL de l'image, par défaut null
  site_web?: string | null; // URL du site web, par défaut null
  id_proprietaire?: number | null; // Clé étrangère vers Proprietaire_Chateau, par défaut null

  chasses?: ChasseType[]; // Liste des chasses liées au château
};

export interface AvatarLinksProps {
  isShowed: boolean;
}

export type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export interface DoubleLineChartProps {
  title: string,
  description: string,
  data: LineChart[];
  firstLineLabel: string;
  secondLineLabel: string;
  className?: string;
}

export type LineChart = {
  x_axis: string,
  firstLine: number,
  secondLine: number
}

export type AvisType = {
  id_avis: number;
  note: number;
  titre: string;
  description: string;
  nb_like: number;
  date_modification: string;
  id_chasse: number;
  id_participant: number;
}

export type ProfilType = {
  id: string; // UUID, non null
  username?: string; // Optionnel, défaut 'anonyme'
  updated_at?: string | null; // Timestamp ISO 8601, nullable
  email: string; // Unique et non null
  birthday?: string | null; // Date ISO 8601, nullable
  email_confirm?: boolean; // Défaut à false
  nom?: string; // Défaut 'Non spécifié'
  prenom?: string; // Défaut 'Non spécifié'
  adresse?: string; // Défaut 'Non spécifiée'
  ville?: string; // Défaut 'Non spécifiée'
  code_postal?: string; // Défaut 'Non spécifié'
  stripe_id?: string | null; // Nullable
  plan: string; // Non null, défaut 'none'
}

export type TexteType = {
  id_texte: number;
  contenu: string;
  id_indice: number | null;
}

/* A modifier avec les ? */
export type MembreEquipeType = {
  id_membre: number; // Identifiant unique, SERIAL, non null
  carte_identite?: string | null; // Peut être null, sinon VARCHAR(255)
  est_verifie?: boolean; // Optionnel, par défaut false
  role_equipe?: string; // Optionnel, par défaut 'Membre'
  id_user: string; // UUID, non null
}

export type Haut_FaitType = {
  id_haut_fait: number;
  titre: string;
  description: string;
  condition: string;
  image_badge: string;
  date: string;
}

export type EquipeOrganisatriceType = {
  id_equipe: number;              // SERIAL PRIMARY KEY, donc un nombre entier auto-incrémenté
  type: string;                   // VARCHAR(255), avec une valeur par défaut 'Association'
  n_siret: string | null;         // VARCHAR(255), peut être null
  id_taxes: string | null;        // VARCHAR(255), peut être null
  nb_membres: number;             // INT, avec une valeur par défaut 0
  site_web: string | null;        // VARCHAR(255), peut être null
  adresse_postale: string;        // VARCHAR(255), avec une valeur par défaut 'Non spécifiée'
  telephone: string | null;       // VARCHAR(20), peut être null
  id_user: string;                // UUID, obligatoire, avec une contrainte de clé étrangère
}

export type RecompenseType = {
  id_recompense: number;
  nom: string;
  description: string;
  type: string;
  valeur: number;
  quantite_dispo: number;
  prix_reel: number;
  image: string | null;
  date_modification: string;
  id_chasse: number | null;
}
