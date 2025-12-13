"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setPrice } from "@/redux/features/addProduct/addProductSlice";
import { setVariationPrice } from "@/redux/features/addProduct/variation/variationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  regularPrice: yup
    .number()
    .min(1, "Regular price must be a positive number")
    .required("Regular price is required!")
    .typeError("Regular price is required!"),
  discountPercent: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Sale price must be a positive number")
    .optional(),
  salePrice: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Sale price must be a positive number")
    .optional(),
  // start: yup.string().optional().default(""),
  // end: yup.string().optional().default(""),
});

type TFormInput = yup.InferType<typeof schema>;
type TProps = {
  isVariation?: boolean;
  index?: number;
};
const Price = ({ isVariation, index }: TProps) => {
  const dispatch = useAppDispatch();
  const { regularPrice, discountPercent, salePrice } = useAppSelector(
    ({ addProduct, productVariation }) => {
      if (isVariation) {
        return productVariation.variations[index || 0]?.price || {};
      } else {
        return addProduct.price;
      }
    }
  );
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [regular, setRegularPrice] = useState(regularPrice);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [discount, setDiscountPercent] = useState<any>(discountPercent);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sale, setSalePrice] = useState<any>(salePrice);

  const handleRegularPriceChange = (e: { target: { value: string } }) => {
    const price = parseFloat(e.target.value);
    dispatch(
      isVariation
        ? setVariationPrice({
            index,
            regularPrice: price,
            discountPercent: 0,
            salePrice: 0,
          })
        : setPrice({
            regularPrice: price,
            discountPercent: 0,
            salePrice: 0,
          })
    );
    setRegularPrice(price);
    setDiscountPercent(0);
    setSalePrice(0);
  };

  const handleSalePriceChange = (e: { target: { value: string } }) => {
    dispatch(
      isVariation
        ? setVariationPrice({
            index,
            regularPrice: regular,
            discountPercent: 0,
            salePrice: 0,
          })
        : setPrice({
            regularPrice: regular,
            discountPercent: 0,
            salePrice: 0,
          })
    );
    const price = parseFloat(e.target.value);
    const calculatedDiscount = ((regular - price) / regular) * 100;
    setSalePrice(price);
    setDiscountPercent(parseFloat(calculatedDiscount.toFixed(2)));
  };

  const handleDiscountChange = (e: { target: { value: string } }) => {
    dispatch(
      isVariation
        ? setVariationPrice({
            index,
            regularPrice: regular,
            discountPercent: 0,
            salePrice: 0,
          })
        : setPrice({
            regularPrice: regular,
            discountPercent: 0,
            salePrice: 0,
          })
    );
    const discount = parseFloat(e.target.value);
    const calculatedSalePrice = regular - (regular * discount) / 100;
    setDiscountPercent(discount);
    setSalePrice(parseFloat(calculatedSalePrice.toFixed()));
  };

  // const onSubmit: SubmitHandler<TFormInput> = ({ start, end }) => {
  const onSubmit: SubmitHandler<TFormInput> = () => {
    dispatch(
      isVariation
        ? setVariationPrice({
            index,
            regularPrice: regular || regularPrice,
            salePrice: isNaN(sale) ? 0 : sale,
            discountPercent: isNaN(discount) ? 0 : discount,
            // date: {
            //   start,
            //   end,
            // },
          })
        : setPrice({
            regularPrice: regular || regularPrice,
            salePrice: isNaN(sale) ? 0 : sale,
            discountPercent: isNaN(discount) ? 0 : discount,
            // date: {
            //   start,
            //   end,
            // },
          })
    );
  };

  return (
    <form onBlur={handleSubmit(onSubmit)} className="pt-2">
      <div className="flex items-center gap-3">
        <Label className="w-40" htmlFor="regularPrice">
          Price
        </Label>
        <div className="w-full">
          <Input
            type="number"
            min={1}
            value={regular || ""}
            {...register("regularPrice")}
            placeholder="Enter regular price"
            id="regularPrice"
            onChange={handleRegularPriceChange}
          />
        </div>
      </div>
      {errors.regularPrice?.message && (
        <p className="text-red-600 ml-44 mt-2">
          {errors.regularPrice?.message as string}
        </p>
      )}
      <div className="flex items-center gap-3 mt-3">
        <Label className="w-40" htmlFor="salePrice">
          Sale Price
        </Label>
        <Input
          type="number"
          min={1}
          value={sale || ""}
          {...register("salePrice")}
          onChange={handleSalePriceChange}
          placeholder="Enter sale price"
          id="salePrice"
        />
      </div>
      {errors.salePrice?.message && (
        <p className="text-red-600 ml-40 mt-2">
          {errors.salePrice?.message as string}
        </p>
      )}
      <div className="flex items-center gap-3 mt-3">
        <Label className="w-40" htmlFor="discount">
          Discount
        </Label>
        <Input
          type="number"
          min={1}
          {...register("discountPercent")}
          value={discount || ""}
          onChange={handleDiscountChange}
          placeholder="Enter discount percentage"
          id="discount"
        />
      </div>
      {errors.discountPercent?.message && (
        <p className="text-red-600 ml-44 mt-2">
          {errors.discountPercent?.message as string}
        </p>
      )}

      {/* <div>
        <div className="grid grid-cols-3 items-center mt-3">
          <Label className="col-span-1" htmlFor="startDate">
            Sale price date
          </Label>
          <div className="col-span-2 flex justify-between items-center xl:justify-evenly">
            <Input
              type="date"
              defaultValue={date?.start || ""}
              {...register("start")}
              className="w-40 xl:w-52"
              id="startDate"
            />
            <Input
              type="date"
              defaultValue={date?.end || ""}
              {...register("end")}
              className="w-40 xl:w-52"
              id="startDate"
            />
          </div>
        </div>
        {errors.start?.message && (
          <p className="text-red-600 mt-2">{errors.start?.message as string}</p>
        )}
        {errors.end?.message && (
          <p className="text-red-600 mt-2">{errors.end?.message as string}</p>
        )}
      </div> */}
    </form>
  );
};

export default Price;
