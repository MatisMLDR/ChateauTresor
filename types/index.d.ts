import { UUID } from "crypto";
import { NoParamCallback } from "fs";

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  price: Stripe.Price;
}

export interface AuthProps {
  redirect: "participant" | "organisateur";
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

export interface AudioPlayerProps {
  soundLink: string;
  className?: string;
}




//// Création de chasse au trésor ////



export type TypeIndice = 'image' | 'son' | 'text'; // Modifié ici

export type IndiceType = {
  id_indice: UUID;
  contenu: string;
  ordre?: number;
  degre_aide: number;
  type: TypeIndice; // Utilise le nouveau TypeIndice
  id_enigme: UUID;
};

// Indice Participant

export type IndiceParticipantType = {
  id_indice: UUID;
  id_participant: UUID;
  est_decouvert?: boolean; // Optionnel avec valeur par défaut `false`
  date_utilisation?: Date; // Optionnel avec valeur par défaut `CURRENT_TIMESTAMP`
}

// Énigme
export type EnigmeType = {
  id_enigme?: UUID;
  id_chasse: UUID;
  titre: string;
  indices?: IndiceType[];
  code_reponse: string;
  ordre?: number;
  description: string;
  endroit_qrcode: string;
  temps_max: number;
  description_reponse: string;
  degre_difficulte: number;
  image_reponse: string;
};


///////////

export type ChasseType = {
  id_chasse?: UUID; // Identifiant unique, SERIAL, non null
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
  id_chateau?: UUID | null; // Peut être null, clé étrangère vers Chateau(id_chateau)
  id_equipe?: UUID;
  chateau?: ChateauType;
  enigmes?: EnigmeType[];
  recompenses?: RecompenseType[];
};

export type ParticipantType = {
  id_participant: UUID;
  nom: string;
  prenom: string;
  email: string;
  id_user: UUID;
  adresse: string;
  ville: string;
  code_postal: string;
  birthday: string;
  plan: string;
  updated_at: string;
  stripe_id: string;

}

export type ChateauType = {
  id_chateau: UUID; // Clé primaire, identifiant du château
  nom?: string; // Nom du château, par défaut 'Château inconnu'
  adresse_postale?: string; // Adresse postale, par défaut 'Non spécifiée'
  localisation?: string; // Localisation, par défaut 'Non spécifiée'
  capacite?: number; // Capacité, par défaut 0
  prix_location?: number; // Prix de location, par défaut 0.00
  telephone?: string | null; // Numéro de téléphone, par défaut null
  description?: string; // Description, par défaut 'Pas de description'
  image?: string | null; // URL de l'image, par défaut null
  site_web?: string | null; // URL du site web, par défaut null
  id_proprietaire?: UUID | null; // Clé étrangère vers Proprietaire_Chateau, par défaut null
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
  id_avis: UUID;
  note: number;
  titre: string;
  description: string;
  nb_like: number;
  date_modification: string;
  id_chasse: UUID;
  id_participant: UUID;
}

export type ProfilType = {
  id_profil: UUID; // UUID, non null
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

/* A modifier avec les ? */
export type MembreEquipeType = {
  id_membre: UUID; // Identifiant unique, SERIAL, non null
  carte_identite?: string | null; // Peut être null, sinon VARCHAR(255)
  est_verifie?: boolean; // Optionnel, par défaut false
  role_equipe?: string; // Optionnel, par défaut 'Membre'
  id_user: UUID; // UUID, non null
}

export type Haut_FaitType = {
  id_haut_fait: UUID;
  titre: string;
  description: string;
  condition: string;
  image_badge: string;
  date: string;
}

export type EquipeOrganisatriceType = {
  id_equipe: UUID;              // SERIAL PRIMARY KEY, donc un nombre entier auto-incrémenté
  nom: string;                   // VARCHAR(255)
  n_siret: string | null;         // VARCHAR(255), peut être null
  id_taxes: string | null;        // VARCHAR(255), peut être null
  nb_membres: number;             // INT, avec une valeur par défaut 0
  site_web: string | null;        // VARCHAR(255), peut être null
  adresse_postale: string;        // VARCHAR(255), avec une valeur par défaut 'Non spécifiée'
  telephone: string | null;       // VARCHAR(20), peut être null              
}

export type RecompenseType = {
  id_recompense?: UUID;
  nom: string;
  description: string;
  type: string;
  valeur: number;
  quantite_dispo: number;
  prix_reel: number;
  image: string | null;
  date_modification: string;
  id_chasse: UUID | null;
}

//// Props de la sidebar ////

export type SideBarProps = {
  children?: React.reactNode;
  type: "participant" | "organisateur";
}

//// Props de la page de profile ////

export type DatePickerProps = {
  defaultDate?: Date;
  className?: string;
}

//// Props du badge d'information pour les chasses ////

export type InfoBadgeProps = {
  children: React.reactNode;
  buttonClassName?: string;
  popupClassName?: string;
  hoverText: string;
}

//// Props pour le système d'affichage des notations ////

export type RatingStarsProps = {
  value: number;
  onChange?: (value: number) => void;
  maxStars?: number;
}