import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TAttribute,
  TInventory,
  TOffer,
  TPrice,
  TProduct,
  TPublishedStatus,
  TSeoData,
} from "./interface";
import { TSelectValue } from "./variation/interface";

const initialState: TProduct = {
  title: "",
  // permalink: "",
  // slug: "",
  // type: "simple",
  description: "",
  shortDescription: "",
  additionalInfo: "",
  usageGuidelines: "",
  price: {
    regularPrice: 0,
    salePrice: 0,
    discountPercent: 0,
    priceSave: 0,
    // date: {
    //   start: "",
    //   end: "",
    // },
  },
  image: {
    thumbnail: "",
    gallery: [],
  },
  inventory: {
    sku: "",
    stockStatus: "In stock",
    stockQuantity: 0,
    stockAvailable: 0,
    preStockQuantity: 0,
    // productCode: "",
    manageStock: false,
    lowStockWarning: 0,
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
  attributes: [],
  variations: [],
  brand: undefined,
  category: {
    name: "",
    subCategory: undefined,
  },
  // tag: [],
  // seoData: {
  //   focusKeyphrase: "",
  //   metaTitle: "",
  //   slug: "",
  //   metaDescription: "",
  // },
  featured: false,
  // downloadable: false,
  // review: false,
  warranty: false,
  warrantyInfo: {
    duration: { quantity: "", unit: "" },
    terms: "",
  },
  publishedStatus: {
    status: "Published",
    visibility: "Public",
    date: "",
  },
};

const productSlice = createSlice({
  name: "addProduct",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setShortDescription: (state, action: PayloadAction<string>) => {
      state.shortDescription = action.payload;
    },
    setAdditionalInfo: (state, action: PayloadAction<string>) => {
      state.additionalInfo = action.payload;
    },
    setUsageGuidelines: (state, action: PayloadAction<string>) => {
      state.usageGuidelines = action.payload;
    },
    // setThumbnail: (state, action: PayloadAction<string>) => {
    //   state.image.thumbnail = action.payload;
    // },
    // setGallery: (state, action: PayloadAction<string[]>) => {
    //   state.image.gallery = [];
    //   state.image.gallery.push(...action.payload);
    // },
    setAttributes: (state, action: PayloadAction<TAttribute[]>) => {
      state.attributes = action.payload;
    },
    setPrice: (state, action: PayloadAction<TPrice>) => {
      state.price = { ...action.payload };
    },
    setInventory: (state, action: PayloadAction<Partial<TInventory>>) => {
      const data = action.payload;

      const stockQuantity = data.stockQuantity as string | number;
      if (stockQuantity == "") {
        state.inventory.manageStock = false;
        state.inventory.lowStockWarning = 0;
        state.inventory.hideStock = false;
      }

      for (const key in data) {
        if (key === "manageStock" && data[key] === false) {
          state.inventory["lowStockWarning"] = 0;
        }
        const typedKey = key as keyof TInventory;
        const value = data[typedKey];
        if (value !== undefined) {
          state.inventory[typedKey] = value as never;
        }
      }
    },
    setOffer: (state, action: PayloadAction<TOffer>) => {
      state.offer = { ...action.payload };
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category.name = action.payload;
    },
    setSubcategory: (state, action: PayloadAction<string | undefined>) => {
      state.category.subCategory = action.payload;
    },
    setBrand: (state, action: PayloadAction<string | undefined>) => {
      state.brand = action.payload;
    },
    setTag: (state, action: PayloadAction<TSelectValue[]>) => {
      state.tag = action.payload;
    },
    setSeoData: (state, action: PayloadAction<TSeoData>) => {
      state.seoData = { ...action.payload };
    },
    setPublishedStatus: (state, action: PayloadAction<TPublishedStatus>) => {
      state.publishedStatus = { ...action.payload };
    },
    setAdvanced: (state, action: PayloadAction<Record<string, unknown>>) => {
      const { featured, warranty, quantity, unit, terms } = action.payload;
      if (featured !== undefined) {
        state.featured = featured as boolean;
      }
      if (warranty !== undefined) {
        state.warranty = warranty as boolean;
      }
      if (quantity !== undefined) {
        state.warrantyInfo.duration.quantity = quantity as string;
      }
      if (unit !== undefined) {
        state.warrantyInfo.duration.unit = unit as string;
      }
      if (terms !== undefined) {
        state.warrantyInfo.terms = terms as string;
      }
    },
    setProduct: (state, action: PayloadAction<TProduct>) => {
      const {
        title,
        description,
        shortDescription,
        additionalInfo,
        usageGuidelines,
        price,
        // image,
        inventory,
        // attributes,
        // brand,
        // category,
        publishedStatus,
      } = action.payload;
      state.title = title;
      state.description = description;
      state.shortDescription = shortDescription;
      state.additionalInfo = additionalInfo;
      state.usageGuidelines = usageGuidelines;
      state.price = price;
      state.inventory = {
        ...inventory,
        preStockQuantity: inventory?.stockQuantity,
      };
      // state.attributes = attributes;
      // state.brand = brand;
      // state.category = category;
      state.publishedStatus = publishedStatus;
    },
    resetProduct: () => {
      return initialState;
    },
  },
});

export const {
  setTitle,
  setDescription,
  setShortDescription,
  setAdditionalInfo,
  setUsageGuidelines,
  // setThumbnail,
  // setGallery,
  setAttributes,
  setPrice,
  setInventory,
  setOffer,
  setCategory,
  setSubcategory,
  setBrand,
  setTag,
  setSeoData,
  setPublishedStatus,
  setAdvanced,
  setProduct,
  resetProduct,
} = productSlice.actions;

export default productSlice.reducer;
