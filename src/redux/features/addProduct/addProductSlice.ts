import {
  PRODUCT_STATUS,
  PRODUCT_TYPE,
  STOCK_STATUS,
  TProductType,
} from "@/const/products";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TAttribute,
  TInventory,
  TOffer,
  TPrice,
  TProduct,
  TSeo,
} from "./interface";
import { TSelectValue } from "./variation/interface";

const initialState: TProduct = {
  title: "",
  // permalink: "",
  slug: "",
  type: PRODUCT_TYPE.SIMPLE,
  description: "",
  previewLink: "",
  shortDescription: "",
  additionalInfo: "",
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
    sku: undefined,
    stockStatus: STOCK_STATUS.IN_STOCK,
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
  productCollection: undefined,
  // tag: [],
  // seo: {
  //   metaTitle: "",
  //   metaDescription: "",
  //   keywords: "",
  //   canonicalUrl: "",
  //   schemaMarkup: "",
  // },
  featured: false,
  // review: false,
  warranty: false,
  warrantyInfo: {
    duration: { quantity: "", unit: "" },
    terms: "",
  },
  publishedStatus: PRODUCT_STATUS.PUBLISHED,
};

const productSlice = createSlice({
  name: "addProduct",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setSlug: (state, action: PayloadAction<string>) => {
      state.slug = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setPreviewLink: (state, action: PayloadAction<string>) => {
      state.previewLink = action.payload;
    },
    setShortDescription: (state, action: PayloadAction<string>) => {
      state.shortDescription = action.payload;
    },
    setAdditionalInfo: (state, action: PayloadAction<string>) => {
      state.additionalInfo = action.payload;
    },
    // setThumbnail: (state, action: PayloadAction<string>) => {
    //   state.image.thumbnail = action.payload;
    // },
    // setGallery: (state, action: PayloadAction<string[]>) => {
    //   state.image.gallery = [];
    //   state.image.gallery.push(...action.payload);
    // },
    // ...
    setProductType: (state, action: PayloadAction<TProductType>) => {
      state.type = action.payload;
    },
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
    setProductCollection: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.productCollection = action.payload;
    },
    setBrand: (state, action: PayloadAction<string | undefined>) => {
      state.brand = action.payload;
    },
    setTag: (state, action: PayloadAction<TSelectValue[]>) => {
      state.tag = action.payload;
    },
    setSeo: (state, action: PayloadAction<TSeo>) => {
      // convert keywords array/string handling is done in ProductForm before sending
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.seo = { ...action.payload } as any;
    },
    setPublishedStatus: (state, action: PayloadAction<string>) => {
      state.publishedStatus = action.payload;
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
    setProduct: (
      state,
      action: PayloadAction<
        Omit<TProduct, "productCollection"> & {
          productCollection?: string | { _id: string };
        }
      >
    ) => {
      const {
        title,
        description,
        previewLink,
        shortDescription,
        additionalInfo,
        type,
        price,
        // image,
        inventory,
        // attributes,
        // brand,
        // category,
        productCollection,
        publishedStatus,
      } = action.payload;
      state.title = title;
      state.description = description;
      state.previewLink = previewLink;
      state.productCollection =
        typeof productCollection === "string"
          ? productCollection
          : productCollection?._id;
      state.shortDescription = shortDescription;
      state.additionalInfo = additionalInfo;
      state.type = type || PRODUCT_TYPE.SIMPLE;
      state.price = price;
      state.slug = action.payload.slug; // Ensure slug is set when editing
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
  setSlug,
  setDescription,
  setPreviewLink,
  setShortDescription,
  setAdditionalInfo,
  setProductType,
  // setThumbnail,
  // setGallery,
  setAttributes,
  setPrice,
  setInventory,
  setOffer,
  setCategory,
  setSubcategory,
  setProductCollection,
  setBrand,
  setTag,
  setSeo,
  setPublishedStatus,
  setAdvanced,
  setProduct,
  resetProduct,
} = productSlice.actions;

export default productSlice.reducer;
