"use client";

import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetAllCouponTagsQuery,
  useUpdateCouponsMutation,
} from "@/redux/features/coupon/couponApi";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import {
  TErrorMessages,
  TErrorResponse,
  TSuccessResponse,
} from "@/types/response/response";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@radix-ui/react-label";
import { Dispatch, SetStateAction, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { SubmitHandler, useForm } from "react-hook-form";
import Creatable from "react-select/creatable";
import * as yup from "yup";
import CouponCategoryProductCondition, {
  TSelectOption,
} from "./CouponCategoryProductCondition";
import CouponForFixedCustomers from "./CouponForFixedCustomers";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const schema = yup.object().shape({
  name: yup.string().optional(),
  code: yup.string().optional(),
  discountType: yup
    .string()
    .oneOf(["percentage", "flat"], "Invalid discount type")
    .optional(),
  discountValue: yup.string(),
  maxDiscount: yup.number().nullable().optional(),
  minimumOrderValue: yup.number().nullable().optional(),
  usageLimit: yup.number().nullable().optional(),
  onlyForRegisteredUsers: yup.string().nullable().optional(),
  // tags: yup.string().optional(),
  endDate: yup.string().optional(),
  startDate: yup.string().optional(),
  shortDescription: yup.string().optional(),
});

export type TFormInput = yup.InferType<typeof schema>;
export type TFixedCustomersInfo = {
  _id: string;
  name: string;
  uid: string;
  phoneNumber: string;
};

const ViewAndUpdateCouponForm = ({
  edit,
  coupon,
  setOpen,
}: {
  edit: boolean;
  coupon: TCoupon;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [fixedCategories, setFixedCategories] = useState<TSelectOption>(
    coupon?.fixedCategories?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || []
  );
  const [restrictedCategories, setRestrictedCategories] =
    useState<TSelectOption>(
      coupon?.restrictedCategories?.map((item) => ({
        value: item._id,
        label: item.name,
      })) || []
    );
  const [fixedProducts, setFixedProducts] = useState<TSelectOption>(
    coupon?.fixedProducts?.map((item) => ({
      value: item._id as string,
      label: item.title,
    })) || []
  );

  const [fixedCustomers, setFixedCustomers] = useState<TFixedCustomersInfo[]>(
    coupon.allowedUsers || []
  );

  const { data: allTagsRes } = useGetAllCouponTagsQuery({});
  const allTags = (allTagsRes?.data?.tags as string[]) || [];

  const [selectedTags, setSelectedTags] = useState<TSelectOption>(
    coupon.tags.map((item) => ({ value: item, label: item }))
  );

  const { toast } = useToast();

  const [startValue, setStartValue] = useState<Value>(
    new Date(coupon.startDate)
  );
  const [value, onChange] = useState<Value>(new Date(coupon.endDate));

  const [serverErrors, setServerErrors] = useState<TErrorMessages[]>([]);

  const [updateCouponFN, { isLoading }] = useUpdateCouponsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: yupResolver(schema),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: { ...(coupon as any) },
  });

  const resetForm = () => {
    reset();
    setFixedCategories([]);
    setRestrictedCategories([]);
    setFixedProducts([]);
    setFixedCustomers([]);
    setSelectedTags([]);
    onChange(new Date());
    setStartValue(new Date());
  };

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    setServerErrors([]);
    data.endDate = new Date(value as unknown as string).toISOString();
    data.startDate = new Date(startValue as unknown as string).toISOString();

    const body = {
      ...data,
      id: coupon._id,
      onlyForRegisteredUsers:
        data.onlyForRegisteredUsers === "true" ? true : false,
      discountValue: Number(data.discountValue) ?? undefined,
      maxDiscount: Number(data.maxDiscount) ?? undefined,
      minimumOrderValue: Number(data.minimumOrderValue) ?? undefined,
      usageLimit: Number(data.usageLimit) ?? undefined,
      tags: selectedTags?.map((item) => item.value),
      fixedProducts: fixedProducts?.map((item) => item.value),
      fixedCategories: fixedCategories?.map((item) => item.value),
      restrictedCategories: restrictedCategories?.map((item) => item.value),
      allowedUsers: fixedCustomers?.map((item) => item._id),
    };

    try {
      const res = (await updateCouponFN(body).unwrap()) as TSuccessResponse;
      if (res.success) {
        resetForm();
        setOpen(false);
        toast({
          className: "toast-success",
          title: res?.message,
        });
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse })?.data;
      setServerErrors(err?.errorMessages);
      toast({
        className: "toast-error",
        title: err?.message,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Coupon name <span className="text-red-600">*</span>
            </Label>
            <Input
              type="text"
              {...register("name")}
              id="name"
              placeholder="Winter 2025"
              className="w-full border-gray-300"
              disabled={!edit}
            />
            {errors.name?.message && (
              <p className="text-red-600 font-bold text-sm">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">
              Coupon code <span className="text-red-600">*</span>
            </Label>
            <Input
              type="text"
              {...register("code")}
              id="code"
              placeholder="WINTER2025"
              className="w-full border-gray-300"
              disabled={!edit}
            />
            {errors.code?.message && (
              <p className="text-red-600 font-bold text-sm">
                {errors.code?.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="discountType">
              Select discount type <span className="text-red-600">*</span>
            </Label>
            <select
              id="discountType"
              className="w-full py-[6px] px-2 outline-gray-200 border-2 border-gray-200 rounded-md"
              defaultValue={"percentage"}
              {...register("discountType")}
              disabled={!edit}
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountValue">
              Discount value<span className="text-red-600">*</span>
            </Label>
            <Input
              type="number"
              {...register("discountValue")}
              id="discountValue"
              placeholder="20"
              className="w-full border-gray-300"
              disabled={!edit}
            />
            {errors.discountValue?.message && (
              <p className="text-red-600 font-bold text-sm">
                {errors.discountValue?.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="maxDiscount">Coupon max discount</Label>
            <Input
              type="number"
              {...register("maxDiscount")}
              id="maxDiscount"
              placeholder="200"
              className="w-full border-gray-300"
              disabled={!edit}
            />
            {errors.maxDiscount?.message && (
              <p className="text-red-600 font-bold text-sm">
                {errors.maxDiscount?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumOrderValue">Minium order amount</Label>
            <Input
              type="number"
              {...register("minimumOrderValue")}
              id="minimumOrderValue"
              placeholder="1490"
              className="w-full border-gray-300"
              disabled={!edit}
            />
            {errors.minimumOrderValue?.message && (
              <p className="text-red-600 font-bold text-sm">
                {errors.minimumOrderValue?.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="usageLimit">Max claim time</Label>
            <Input
              type="number"
              {...register("usageLimit")}
              id="usageLimit"
              placeholder="Enter max claim time"
              className="w-full border-gray-300"
              disabled={!edit}
            />
            {errors.usageLimit?.message && (
              <p className="text-red-600 font-bold text-sm">
                {errors.usageLimit?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="onlyForRegisteredUsers">
              Is only for registered user?
            </Label>
            <select
              id="onlyForRegisteredUsers"
              className="w-full py-[6px] px-2 outline-gray-200 border-2 border-gray-200 rounded-md"
              defaultValue={"false"}
              {...register("onlyForRegisteredUsers")}
              disabled={!edit}
            >
              <option value={"true"}>Yes</option>
              <option value={"false"}>No</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="tags">Tags</Label>
          <Creatable
            id="tags"
            isMulti
            options={allTags?.map((item) => ({ value: item, label: item }))}
            isSearchable={true}
            isClearable={true}
            onChange={(v) => setSelectedTags(v)}
            value={selectedTags}
            isDisabled={!edit}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea
            {...register("shortDescription")}
            id="shortDescription"
            className="w-full border-gray-300"
            placeholder="Type short description here"
            disabled={!edit}
          />
          {errors.shortDescription?.message && (
            <p className="text-red-600 font-bold text-sm">
              {errors.shortDescription?.message}
            </p>
          )}
        </div>

        <hr />

        <div>
          <CouponCategoryProductCondition
            fixedCategories={fixedCategories}
            fixedProducts={fixedProducts}
            restrictedCategories={restrictedCategories}
            setFixedProducts={setFixedProducts}
            setFixedCategories={setFixedCategories}
            setRestrictedCategories={setRestrictedCategories}
            edit={edit}
          />
        </div>

        <div>
          <CouponForFixedCustomers
            setFixedCustomers={setFixedCustomers}
            fixedCustomers={fixedCustomers}
            edit={edit}
          />
        </div>

        <hr />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName" className="col-span-2">
              Select start time<span className="text-red-600">*</span>
            </Label>
            <DateTimePicker
              className="col-span-6"
              onChange={setStartValue}
              value={startValue}
              disabled={!edit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName" className="col-span-2">
              Select end time<span className="text-red-600">*</span>
            </Label>
            <DateTimePicker
              className="col-span-6"
              onChange={onChange}
              value={value}
              disabled={!edit}
            />
          </div>
        </div>

        {serverErrors?.length ? (
          <div>
            <ul className="list-disc ml-5">
              {serverErrors.map((item, index) => (
                <li className="text-red-600 font-bold text-sm" key={index}>
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {edit ? (
          <EcButton disabled={isLoading} loading={isLoading} type="submit">
            Update
          </EcButton>
        ) : null}
      </form>
    </div>
  );
};

export default ViewAndUpdateCouponForm;
