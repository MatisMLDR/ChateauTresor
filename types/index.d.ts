declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

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

interface LoginFormProps {
  error?: string | string[];
}

interface SignupFormProps {
  error?: string | string[];
}