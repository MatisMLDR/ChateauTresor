interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  price: Stripe.Price;
}

interface InputWithLabelProps {
  label: string;
  inputType: string;
  inputPlaceholder?: string;
  inputId;
  className?: string;
}

interface SliderWithBoundsProps {
  min: number;
  max: number;
  step: number;
  className?: string;
}

interface TitleTwoProps {
  text: string;
  color: 'light' | 'dark';
  className?: string;
}

interface NavigationVerticaleItemsProps {
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

type Chasse = {
  id_chasse: number;
  titre: string;
  description: string;
  image: string;
  difficulte: number;
  prix: number;
  date_debut: string;
  date_fin: string;
};

type Chateau = {
  id_chateau: number;
  nom: string;
  description: string;
  image: string;
  localisation: string; // Format : "latitude,longitude"
  chasses?: Chasse[];
};

interface AvatarLinksProps {
  isShowed: boolean;
}

interface DoubleLineChartProps {
  title: string,
  description: string,
  data: LineChart[];
  firstLineLabel: string;
  secondLineLabel: string;
  className?: string;
}

type LineChart = {
  x_axis: string,
  firstLine: number,
  secondLine: number
}