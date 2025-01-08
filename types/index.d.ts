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

export type Castle = {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  address: string;
};

export type ClueType = 'image' | 'sound' | 'text';

// Indice
export type Clue = {
  id: string;
  type: ClueType;
  content: string;
  degre_aide: number;
};

// Énigme
export type Riddle = {
  id: string;
  titre: string;
  clues: Clue[];
  qrCode: string;
  code: string;
  description: string;
  endroit_qrcode: string;
  temps_max: number;
  description_reponse: string;
  image_reponse: string;
};

export type TreasureHunt = {
  id_chasse: string;
  titre: string;
  description: string;
  castle: Castle;
  prix: number;
  capacite: number;
  duree_estime: number;
  difficulte: 'easy' | 'medium' | 'hard';
  age_requis:number;
  date_debut: string,
  date_fin: string,
  theme: string;
  riddles: Riddle[];
  imageUrl: string;
  createdBy: string;
};

export type ChasseType = {
  id_chasse: number;
  image: string;
  titre: string;
  description: string;
  image: string;
  difficulte: number;
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
  enigmes: Riddle[];
  chateau: ChateauType;
};

export type ChateauType = {
  id_chateau: number;
  nom: string;
  description: string;
  image: string;
  localisation: string; // Format : "latitude,longitude"
  chasses?: Chasse[];
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
