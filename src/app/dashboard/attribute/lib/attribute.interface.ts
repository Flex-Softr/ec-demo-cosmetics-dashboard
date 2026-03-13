export type TAttribute = {
  _id: string;
  name: string;
  isActive: boolean;
  values?: { _id: string; name: string }[];
};

export type TAttributeForm = {
  name: string;
  isActive: boolean;
  values: string[];
};

export type TAttributeValueItem = {
  _id?: string;
  name: string;
};
export type TAttributeValueForm = {
  _id: string;
  name: string;
};
