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
}

interface SliderWithBoundsProps {
  min: number;
  max: number;
  step: number;
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