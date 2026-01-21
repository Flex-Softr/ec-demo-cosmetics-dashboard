/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/config/config";
import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { useGetShippingChargeQuery } from "@/redux/features/shippingCharge/shippingCharge";
import { useMemo } from "react";
import { Control, useWatch } from "react-hook-form";
import { TFormInput } from "../components/OrderForm";

export const useOrderCalculation = (control: Control<TFormInput>) => {
  const { data: productsData } = useGetProductsQuery({ limit: 0 });
  const { data: shippingData } = useGetShippingChargeQuery({});

  const orderedProducts = useWatch({
    control,
    name: "orderedProducts",
  });

  const totalNumberOfItems =
    orderedProducts?.reduce(
      (acc, item) => acc + (Number(item?.quantity) || 0),
      0
    ) || 0;

  const shippingCostExceptFirst = Math.max(
    0,
    parseFloat(
      Number(
        (totalNumberOfItems - 1) * config.per_item_shipping_cost
      ).toString()
    )
  ).toFixed(2);

  const selectedShippingChargeId = useWatch({
    control,
    name: "shippingCharge",
  });

  const discount =
    useWatch({
      control,
      name: "discount",
    }) || 0;

  const advance =
    useWatch({
      control,
      name: "advance",
    }) || 0;

  const calculation = useMemo(() => {
    if (!productsData?.data?.data)
      return {
        subtotal: 0,
        shippingCost: 0,
        discount,
        advance,
        total: 0,
        orderedProducts: [],
        shippingCostExceptFirst,
      };

    let subtotal = 0;
    const orderedProductsDetails = (orderedProducts || []).map((item: any) => {
      const product = productsData.data.data.find(
        (p: any) => p._id === item.product
      );
      if (!product) return { ...item, unitPrice: 0, total: 0 };

      let unitPrice = product.salePrice || product.regularPrice || 0;

      // If variation is selected, try to find its price
      // Note: This assumes variations are loaded. In a real scenario,
      // we might need to fetch the specific product for variations if not in the bulk list.
      if (item.variation && product.variations) {
        const variationId =
          typeof item.variation === "string"
            ? item.variation
            : item.variation._id;

        const variation = product.variations.find(
          (v: any) => v._id === variationId
        );
        if (variation && variation.price) {
          unitPrice =
            variation.price.salePrice ||
            variation.price.regularPrice ||
            unitPrice;
        }
      }

      const total = unitPrice * (item.quantity || 0);
      subtotal += total;

      return {
        ...item,
        title: product.title,
        type: product.type,
        unitPrice,
        total,
      };
    });

    const shippingCharge = shippingData?.data?.find(
      (s: any) => s._id === selectedShippingChargeId
    );
    const shippingCost = shippingCharge?.amount || 0;

    const total =
      subtotal +
      Number(shippingCost + Number(shippingCostExceptFirst)) -
      Number(discount) -
      Number(advance);

    return {
      subtotal,
      shippingCost,
      discount,
      advance,
      total,
      orderedProducts: orderedProductsDetails,
      shippingCostExceptFirst,
    };
  }, [
    productsData,
    shippingData,
    orderedProducts,
    selectedShippingChargeId,
    discount,
    advance,
    shippingCostExceptFirst,
  ]);

  return calculation;
};
