import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TInventory, TPrice } from "../interface";
import {
  TSelectedAttribute,
  TSelectValue,
  TVariation,
  TVariationInitialState,
} from "./interface";

// const variations: TVariation = {
//   attributes: {},
//   image: "",
//   price: {
//     regularPrice: 0,
//     salePrice: 0,
//     discountPercent: 0,
//     date: {
//       start: "",
//       end: "",
//     },
//   },
//   inventory: {
//     sku: "",
//     stockStatus: "",
//     stockQuantity: 0,
//     productCode: "",
//     lowStockWarning: 0,
//     manageStock: false,
//     showStockQuantity: false,
//     showStockWithText: false,
//     hideStock: false,
//     soldIndividually: false,
//   },
//   offer: {
//     flash: false,
//     today: false,
//     featured: false,
//   },
// };

const initialState: TVariationInitialState = {
  selectedAttribute: [],
  selectedAttributeValue: [],
  generatedVariations: [],
  variations: [],
};

const variationSlice = createSlice({
  name: "productVariation",
  initialState,
  reducers: {
    setSelectedAttribute: (
      state,
      action: PayloadAction<TSelectedAttribute[]>
    ) => {
      state.generatedVariations = [];
      // state.variations = [];
      state.selectedAttribute = action.payload;
      const newArray = state.selectedAttributeValue.filter((itemB) =>
        action.payload.some((itemA) => itemA.value === itemB.value)
      );
      state.selectedAttributeValue = newArray;
    },
    setSelectedAttributeValue: (
      state,
      action: PayloadAction<{ index: number; child: TSelectValue[] }>
    ) => {
      state.generatedVariations = [];
      // state.variations = [];
      const { index, child } = action.payload;
      if (state.selectedAttributeValue[index]) {
        state.selectedAttributeValue[index].child = child;
      } else {
        const attributes = { ...state.selectedAttribute[index] };
        attributes.child = child;
        state.selectedAttributeValue.push(attributes);
      }
    },
    setDefaultSelectedAttributeValue: (
      state,
      action: PayloadAction<TSelectedAttribute[]>
    ) => {
      state.selectedAttributeValue = action.payload;
    },
    setGeneratedVariations: (state, action: PayloadAction<TVariation[]>) => {
      state.generatedVariations = action.payload;
      state.variations = action.payload;
    },
    setRemoveSingleVariation: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.generatedVariations = state.generatedVariations.filter(
        (item, index) => index !== i
      );
      state.variations = [];
    },
    setVariationAttributes: (
      state,
      action: PayloadAction<{ index: number; item: { [key: string]: string } }>
    ) => {
      const { index, item } = action.payload;
      if (state.variations[index]) {
        state.variations[index].attributes = item;
      } else {
        // If variations[index] does not exist, push a new object with attributes
        state.variations.push({
          attributes: item,
          // image: "",
          price: {
            regularPrice: 0,
            salePrice: 0,
            discountPercent: 0,
            // date: {
            //   start: "",
            //   end: "",
            // },
          },
          inventory: {
            // sku: "",
            stockStatus: "",
            stockQuantity: 0,
            stockAvailable: 0,
            preStockQuantity: 0,
            // productCode: "",
            lowStockWarning: 0,
            manageStock: false,
            // showStockQuantity: false,
            // showStockWithText: false,
            hideStock: false,
            // soldIndividually: false,
          },
          // offer: {
          //   flash: false,
          //   today: false,
          //   featured: false,
          // },
        });
      }
    },
    setDefaultVariation: (state, action: PayloadAction<TVariation[]>) => {
      const variations = action.payload?.map(
        ({ inventory, ...remainingData }) => {
          return {
            ...remainingData,
            inventory: {
              ...inventory,
              preStockQuantity: inventory?.stockQuantity,
            },
          };
        }
      );
      state.variations = variations;
    },
    // setVariationThumbnail: (
    //   state,
    //   action: PayloadAction<{ index: number; image: string }>
    // ) => {
    //   const { index, image } = action.payload;
    //   state.variations[index].image = image;
    // },
    setVariationPrice: (state, action: PayloadAction<TPrice>) => {
      const { index, ...remainingData } = action.payload;
      state.variations[index || 0].price = { ...remainingData };
    },
    setVariationInventory: (
      state,
      action: PayloadAction<Partial<TInventory>>
    ) => {
      const data = action.payload;
      for (const key in data) {
        const typedKey = key as keyof TInventory;
        const value = data[typedKey];
        if (value !== undefined) {
          state.variations[action.payload.index || 0].inventory[typedKey] =
            value as never;
        }
      }
    },
    // setVariationOffer: (state, action: PayloadAction<TOffer>) => {
    //   state.variations[action.payload.index || 0].offer = { ...action.payload };
    // },
    resetVariation: (state) => {
      state.selectedAttribute = initialState.selectedAttribute;
      state.selectedAttributeValue = initialState.selectedAttributeValue;
      state.generatedVariations = initialState.generatedVariations;
      state.variations = initialState.variations;
    },
  },
});

export const {
  setSelectedAttribute,
  setSelectedAttributeValue,
  setDefaultSelectedAttributeValue,
  setGeneratedVariations,
  setRemoveSingleVariation,
  setVariationAttributes,
  // setVariationThumbnail,
  // setVariationGallery,
  setVariationPrice,
  setVariationInventory,
  // setVariationOffer,
  setDefaultVariation,
  resetVariation,
} = variationSlice.actions;

export default variationSlice.reducer;
