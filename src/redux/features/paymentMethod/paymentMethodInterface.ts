export type TRequiredInput = {
  type: "text" | "number" | "select";
  name: string;
  is_required: boolean;
  enums?: string; // comma separated for select
};

export type TPaymentMethod = {
  _id: string;
  name: string;
  instructions?: string;
  isActive: boolean;
  image?: string;
  required_inputs?: TRequiredInput[];
  createdAt?: string;
  updatedAt?: string;
};

export type TPaymentMethodResponse = {
  data: TPaymentMethod[];
  message?: string;
  success?: boolean;
};

export type TSinglePaymentMethodResponse = {
  data: TPaymentMethod;
  message?: string;
  success?: boolean;
};
