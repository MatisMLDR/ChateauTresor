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
  id: string;
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

type ChasseType = {
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

type ChateauType = {
  id_chateau: number;
  nom: string;
  description: string;
  image: string;
  localisation: string;// Format : "latitude,longitude"
  chasses?: Chasse[];
};

interface AvatarLinksProps {
  isShowed: boolean;
}

type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
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
