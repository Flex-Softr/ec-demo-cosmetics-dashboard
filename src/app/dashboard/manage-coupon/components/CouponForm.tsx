/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateCouponMutation,
  useGetAllCouponTagsQuery,
  useUpdateCouponsMutation,
} from "@/redux/features/coupon/couponApi";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import {
  TErrorMessages,
  TErrorResponse,
  TSuccessResponse,
} from "@/types/response";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Creatable from "react-select/creatable";
import * as yup from "yup";
import CouponCategoryProductCondition, {
  TSelectOption,
} from "./CouponCategoryProductCondition";
import CouponForFixedCustomers, {
  TFixedCustomersInfo,
} from "./CouponForFixedCustomers";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  code: yup.string().required("Code is required"),
  discountType: yup
    .string()
    .oneOf(["percentage", "flat"], "Invalid discount type")
    .required("Discount type is required"),
  discountValue: yup.string().required("Discount value is required"),
  maxDiscount: yup.string().optional(),
  minimumOrderValue: yup.string().optional(),
  usageLimit: yup.string().optional(),
  onlyForRegisteredUsers: yup.string().optional(),
  endDate: yup.string().optional(),
  startDate: yup.string().optional(),
  shortDescription: yup.string().optional(),
});

export type TCouponFormInput = yup.InferType<typeof schema>;

type CouponFormProps = {
  initialData?: TCoupon;
};

const CouponForm = ({ initialData }: CouponFormProps) => {
  const isEdit = Boolean(initialData?._id);
  const router = useRouter();
  const { toast } = useToast();

  const [fixedCategories, setFixedCategories] = useState<TSelectOption>(
    initialData?.fixedCategories?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || []
  );
  const [restrictedCategories, setRestrictedCategories] =
    useState<TSelectOption>(
      initialData?.restrictedCategories?.map((item) => ({
        value: item._id,
        label: item.name,
      })) || []
    );
  const [fixedProducts, setFixedProducts] = useState<TSelectOption>(
    initialData?.fixedProducts?.map((item) => ({
      value: item._id as string,
      label: item.title,
    })) || []
  );
  const [fixedCustomers, setFixedCustomers] = useState<TFixedCustomersInfo[]>(
    initialData?.allowedUsers || []
  );
  const [selectedTags, setSelectedTags] = useState<TSelectOption>(
    initialData?.tags?.map((item) => ({ value: item, label: item })) || []
  );

  const [startValue, setStartValue] = useState<Value>(
    initialData?.startDate ? new Date(initialData.startDate) : new Date()
  );
  const [endValue, setEndValue] = useState<Value>(
    initialData?.endDate ? new Date(initialData.endDate) : new Date()
  );
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [serverErrors, setServerErrors] = useState<TErrorMessages[]>([]);

  const { data: allTagsRes } = useGetAllCouponTagsQuery({});
  const responseData: any = allTagsRes?.data;
  const allTags =
    (responseData?.data?.tags as string[]) ||
    (allTagsRes?.data?.tags as string[]) ||
    [];

  const [createCouponFn, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCouponFn, { isLoading: isUpdating }] =
    useUpdateCouponsMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TCouponFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      discountType: initialData?.discountType || "percentage",
      discountValue: initialData?.discountValue?.toString() || "",
      maxDiscount: initialData?.maxDiscount?.toString() || "",
      minimumOrderValue: initialData?.minimumOrderValue?.toString() || "",
      usageLimit: initialData?.usageLimit?.toString() || "",
      onlyForRegisteredUsers: initialData?.onlyForRegisteredUsers
        ? "true"
        : "false",
      shortDescription: initialData?.shortDescription || "",
    },
  });

  const onSubmit: SubmitHandler<TCouponFormInput> = async (data) => {
    setEndDateError("");
    setStartDateError("");
    setServerErrors([]);

    data.endDate = new Date(endValue as unknown as string).toISOString();
    data.startDate = new Date(startValue as unknown as string).toISOString();

    if (!isEdit) {
      if (new Date(Date.now()) > new Date(data.endDate)) {
        setEndDateError("The selected end date must be a future date");
        return;
      }
      if (new Date(Date.now()) > new Date(data.startDate)) {
        setStartDateError("The selected start date must be a future date");
        return;
      }
    }

    const body = {
      ...data,
      onlyForRegisteredUsers: data.onlyForRegisteredUsers === "true",
      discountValue: Number(data.discountValue) || undefined,
      maxDiscount: Number(data.maxDiscount) || undefined,
      minimumOrderValue: Number(data.minimumOrderValue) || undefined,
      usageLimit: Number(data.usageLimit) || undefined,
      tags: selectedTags.length
        ? selectedTags.map((item) => item.value)
        : undefined,
      fixedProducts: fixedProducts.length
        ? fixedProducts.map((item) => item.value)
        : undefined,
      fixedCategories: fixedCategories.length
        ? fixedCategories.map((item) => item.value)
        : undefined,
      restrictedCategories: restrictedCategories.length
        ? restrictedCategories.map((item) => item.value)
        : undefined,
      allowedUsers: fixedCustomers.length
        ? fixedCustomers.map((item) => item._id)
        : undefined,
    };

    try {
      let res: TSuccessResponse;
      if (isEdit && initialData?._id) {
        res = (await updateCouponFn({
          ...body,
          id: initialData._id,
        }).unwrap()) as TSuccessResponse;
      } else {
        res = (await createCouponFn(body).unwrap()) as TSuccessResponse;
      }

      if (res.success) {
        toast({
          className: "toast-success",
          title: res?.message,
        });
        router.push("/dashboard/manage-coupon");
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse })?.data;
      setServerErrors(err?.errorMessages || []);
      toast({
        className: "toast-error",
        title: err?.message || "Something went wrong",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Coupon name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Winter 2025"
            className="rounded-lg"
            {...register("name")}
          />
          {errors.name?.message ? (
            <p className="text-sm font-medium text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">
            Coupon code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="code"
            placeholder="WINTER2025"
            className="rounded-lg"
            {...register("code")}
          />
          {errors.code?.message ? (
            <p className="text-sm font-medium text-destructive">
              {errors.code.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>
            Discount type <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="discountType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">
            Discount value <span className="text-destructive">*</span>
          </Label>
          <Input
            id="discountValue"
            placeholder="20"
            className="rounded-lg"
            {...register("discountValue")}
          />
          {errors.discountValue?.message ? (
            <p className="text-sm font-medium text-destructive">
              {errors.discountValue.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="maxDiscount">Max discount</Label>
          <Input
            id="maxDiscount"
            placeholder="200"
            className="rounded-lg"
            {...register("maxDiscount")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimumOrderValue">Minimum order amount</Label>
          <Input
            id="minimumOrderValue"
            placeholder="1490"
            className="rounded-lg"
            {...register("minimumOrderValue")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="usageLimit">Max claim times</Label>
          <Input
            id="usageLimit"
            placeholder="Enter max claim times"
            className="rounded-lg"
            {...register("usageLimit")}
          />
        </div>
        <div className="space-y-2">
          <Label>Only for registered users?</Label>
          <Controller
            control={control}
            name="onlyForRegisteredUsers"
            render={({ field }) => (
              <Select
                value={field.value || "false"}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Creatable
          id="tags"
          isMulti
          options={allTags.map((item) => ({ value: item, label: item }))}
          isSearchable
          isClearable
          placeholder="Select or create tags…"
          onChange={(v) => setSelectedTags(v)}
          value={selectedTags}
          classNames={{
            control: () => "!min-h-10 !rounded-lg !border-border",
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short description</Label>
        <Textarea
          id="shortDescription"
          placeholder="Type short description here"
          className="min-h-[90px] rounded-lg"
          {...register("shortDescription")}
        />
      </div>

      <div className="border-t border-border pt-5">
        <CouponCategoryProductCondition
          fixedCategories={fixedCategories}
          fixedProducts={fixedProducts}
          restrictedCategories={restrictedCategories}
          setFixedProducts={setFixedProducts}
          setFixedCategories={setFixedCategories}
          setRestrictedCategories={setRestrictedCategories}
        />
      </div>

      <div className="border-t border-border pt-5">
        <CouponForFixedCustomers
          setFixedCustomers={setFixedCustomers}
          fixedCustomers={fixedCustomers}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>
            Start time <span className="text-destructive">*</span>
          </Label>
          <DateTimePicker
            className="react-datetime-picker--coupon"
            onChange={setStartValue}
            value={startValue}
          />
          {startDateError ? (
            <p className="text-sm font-medium text-destructive">
              {startDateError}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label>
            End time <span className="text-destructive">*</span>
          </Label>
          <DateTimePicker
            className="react-datetime-picker--coupon"
            onChange={setEndValue}
            value={endValue}
          />
          {endDateError ? (
            <p className="text-sm font-medium text-destructive">
              {endDateError}
            </p>
          ) : null}
        </div>
      </div>

      {serverErrors.length ? (
        <ul className="list-disc space-y-1 pl-5">
          {serverErrors.map((item, index) => (
            <li className="text-sm font-medium text-destructive" key={index}>
              {item.message}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          asChild
        >
          <Link href="/dashboard/manage-coupon">Cancel</Link>
        </Button>
        <Button
          type="submit"
          size="sm"
          className="rounded-lg"
          disabled={isLoading}
        >
          {isLoading
            ? isEdit
              ? "Updating…"
              : "Creating…"
            : isEdit
              ? "Update Coupon"
              : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
};

export default CouponForm;
