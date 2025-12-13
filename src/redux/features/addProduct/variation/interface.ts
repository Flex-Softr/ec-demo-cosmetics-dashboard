import { TInventory, TOffer, TPrice } from "../interface";

export type TSelectValue = {
  label: string;
  value: string;
};

export type TSelectedAttribute = {
  label: string;
  value?: string;
  child: TSelectValue[];
};

// export type TSelectedAttributeValue = {
//   [key: string]: TSelectValue[];
// };

export type TVariation = {
  _id?: string;
  attributes: {
    [key: string]: string;
  };
  price: TPrice;
  image?: string;
  inventory: TInventory;
  offer?: TOffer;
  isDeleted?: boolean;
};

export type TVariationInitialState = {
  selectedAttribute: TSelectedAttribute[];
  // selectedAttributeValue: TSelectedAttributeValue;
  selectedAttributeValue: TSelectedAttribute[];
  generatedVariations: {
    _id?: string;
    attributes: { [key: string]: string };
    isDeleted?: boolean;
  }[];
  variations: TVariation[];
};
