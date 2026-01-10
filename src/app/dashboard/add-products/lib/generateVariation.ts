import {
  TSelectedAttribute,
  TVariation,
} from "@/redux/features/addProduct/variation/interface";

import { STOCK_STATUS } from "@/const/products";

const generateVariations = (
  variations: TSelectedAttribute[],
  existingVariations: TVariation[]
) => {
  const result: TVariation[] = [];

  const generateCombination = (
    index: number,
    combination: { [key: string]: string }
  ) => {
    if (index === variations.length) {
      // Try to find existing variation with same attributes
      const match = existingVariations.find((v) =>
        isSameAttributes(v.attributes, combination)
      );

      result.push({
        attributes: { ...combination },
        price: match?.price || {
          regularPrice: undefined,
          salePrice: undefined,
          discountPercent: undefined,
          priceSave: undefined,
        },
        inventory: match?.inventory || {
          sku: "",
          stockStatus: STOCK_STATUS.IN_STOCK,
          stockQuantity: undefined,
          preStockQuantity: undefined,
          stockAvailable: undefined,
          manageStock: false,
          lowStockWarning: undefined,
          hideStock: false,
        },
        _id: match?._id,
        isDeleted: match?.isDeleted,
      });

      return;
    }

    const current = variations[index];
    current.child?.forEach((option) => {
      const newCombo = {
        ...combination,
        [current.label]: option.label,
      };
      generateCombination(index + 1, newCombo);
    });
  };

  generateCombination(0, {});
  return result;
};

// Helper to compare attribute objects
const isSameAttributes = (
  a: { [key: string]: string },
  b: { [key: string]: string }
) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
};

export default generateVariations;
