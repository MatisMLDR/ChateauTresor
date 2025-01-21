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

export type FileType = File | string; // File pour les uploads, string pour les URLs

export type ImageFile = FileType; // Pour les images
export type AudioFile = FileType; // Pour les fichiers audio
export type TextFile = string; // Pour les fichiers texte (pas de File ici, car c'est du texte)


export type IndiceType = {
  id_indice: UUID;
  contenu: ImageFile | AudioFile | TextFile; // Contenu peut être une image, un son ou du texte
  ordre?: number;
  degre_aide: number;
  type: 'image' | 'son' | 'text'; // Type de l'indice
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
  image_reponse: ImageFile; // Image de la réponse
};

///////////

export type ChasseType = {
  id_chasse?: UUID;
  titre?: string;
  capacite?: number;
  description?: string;
  age_requis?: number;
  image: ImageFile; // Image de la chasse
  date_creation?: string;
  date_modification?: string;
  date_debut?: string | null;
  date_fin?: string | null;
  prix?: number;
  difficulte?: number;
  duree_estime?: string;
  theme?: string;
  statut?: string;
  id_chateau?: UUID | null;
  id_equipe?: UUID;
  chateau?: ChateauType;
  enigmes?: EnigmeType[];
  recompenses?: RecompenseType[];
  horaire_debut?: string;
  horaire_fin?: string;
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
  id_chateau: UUID;
  nom?: string;
  adresse_postale?: string;
  localisation?: string;
  capacite?: number;
  prix_location?: number;
  telephone?: string | null;
  description?: string;
  image: ImageFile; // Image du château
  site_web?: string | null;
  id_proprietaire?: UUID | null;
  chasses?: ChasseType[];
};

export type ProprietaireType = {
  id_proprietaire: UUID;
  id_user: UUID;
}

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
  id_membre: UUID; // UUID, non null
  id_user: UUID; // UUID, non null
}
/* A modifier avec les ? */
export type AppartenanceEquipeType = {
  id_membre: UUID; // Identifiant unique, SERIAL, non null
  role_equipe?: string; // Optionnel, par défaut 'Membre'
  date_demande?: string; // Optionnel, TIMESTAMP, par défaut CURRENT_TIMESTAMP
  message_demande?: string; // Optionnel, par défaut 'Pas de message'
  role_equipe?: string; // Optionnel, par défaut 'Invité'
  date_appartenance?: string; // Optionnel, DATE, par défaut CURRENT_DATE
  statut?: string; // Optionnel, par défaut 'En attente de validation'
  id_equipe: UUID; // UUID, non null
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
  id_equipe: UUID;
  nom: string;
  type: "Société" | "Particulier";
  n_siret: string | null;
  id_taxes: string | null;
  site_web: string | null;
  adresse_postale: string;
  date_creation: string;
  telephone: string | null;
  statut_verification: string;
  carte_identite_chef: string | null;
  description: string | null;
}

export type RecompenseType = {
  id_recompense?: UUID;
  nom: string;
  description: string;
  type: string;
  valeur: number;
  quantite_dispo: number;
  prix_reel: number;
  image: ImageFile | null; // Image de la récompense
  date_modification: string;
  id_chasse: UUID | null;
};

//// Props de la sidebar ////

export type SideBarProps = {
  children?: React.reactNode;
  type: "participant" | "organisateur" | "proprietaire";
  fullyUnlocked?: boolean;
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