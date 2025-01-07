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

export type Clue = {
  id: string;
  type: ClueType;
  content: string;
};

export type Riddle = {
  id: string;
  question: string;
  clues: Clue[];
  qrCode: string;
  code: string;
};

export type TreasureHunt = {
  id: string;
  title: string;
  description: string;
  castle: Castle;
  price: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
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