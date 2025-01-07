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

interface TitleTwoProps {
  text: string;
  color: 'light' | 'dark';
  className?: string;
}

