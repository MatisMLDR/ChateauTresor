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
  id_chasse: number;
  image: string;
  titre: string;
  description: string;
  image: string;
  difficulte: number | 0;
  prix: number;
  date_debut: string;
  date_fin: string;
  capacite: number;
  age_requis: number;
  duree_estime: number;
  theme: string;
  id_chateau: number;
  id_equipe: number;
  statut: string;
  date_modification: string;
  chateau: ChateauType;
  nb_enigmes: number;
  enigmes: EnigmeType[];
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
  id_chateau: number;
  nom: string;
  adresse_postale: string;
  localisation: string; // Format : "latitude,longitude"
  capacite: number;
  prix_location: number;
  telephone: string | null;
  description: string;
  image: string | null;
  site_web: string | null;
  id_proprietaire: number | null; // Référence vers Proprietaire_Chateau
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
};


