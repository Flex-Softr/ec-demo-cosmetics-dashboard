import { TProduct } from "@/redux/features/addProduct/interface";
import { TVariation } from "@/redux/features/addProduct/variation/interface";

const modifiedVariations = (variations: TVariation[], product: TProduct) => {
  return [...variations].map(({ _id, attributes, price, inventory }) => {
    const { regularPrice, salePrice, discountPercent } = product.price;
    const {
      stockStatus,
      stockQuantity,
      stockAvailable,
      manageStock,
      lowStockWarning,
      hideStock,
    } = product.inventory;

    const modifiedPrice = { ...price };
    const modifiedInventory = { ...inventory };

    if (!modifiedPrice.regularPrice) {
      modifiedPrice.regularPrice = regularPrice;
    }
    if (!modifiedPrice.salePrice) {
      modifiedPrice.salePrice = salePrice;
    }
    if (!modifiedPrice.discountPercent) {
      modifiedPrice.discountPercent = discountPercent;
    }
    const save = modifiedPrice.regularPrice - (modifiedPrice.salePrice || 0);
    modifiedPrice.priceSave = save === modifiedPrice.regularPrice ? 0 : save;
    // if (modifiedInventory.sku === "") {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     delete (modifiedInventory as any).sku;
    // }
    if (!modifiedInventory.stockStatus) {
      modifiedInventory.stockStatus = stockStatus;
    }
    if (!modifiedInventory.stockQuantity) {
      modifiedInventory.stockQuantity = stockQuantity;
    }
    if (!modifiedInventory.manageStock) {
      modifiedInventory.manageStock = manageStock;
      modifiedInventory.lowStockWarning = lowStockWarning;
    }
    if (!modifiedInventory.stockAvailable) {
      modifiedInventory.stockAvailable =
        stockAvailable || modifiedInventory.stockQuantity;
    }

    const stockQuantityIncrease =
      modifiedInventory.stockQuantity - modifiedInventory.preStockQuantity;

    if (
      modifiedInventory.stockQuantity != stockQuantityIncrease &&
      stockQuantityIncrease != 0
    ) {
      modifiedInventory.stockAvailable += stockQuantityIncrease;
    }

    if (!modifiedInventory.hideStock && hideStock) {
      modifiedInventory.hideStock = hideStock;
    }

    return {
      _id,
      attributes,
      price: modifiedPrice,
      inventory: modifiedInventory,
    };
  });
};

export default modifiedVariations;
