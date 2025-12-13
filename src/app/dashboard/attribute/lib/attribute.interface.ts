export type TAttribute = {
  _id: string;
  name: string;
  values?: [{ _id: string; name: string }]; // Changed from 'attributeValues' to 'values'
};

export type TAttributeForm = {
  name: string;
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
