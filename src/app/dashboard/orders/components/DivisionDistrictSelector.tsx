"use client";

import { useEffect } from "react";
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { useGetShippingChargeQuery } from "@/redux/features/shippingCharge/shippingCharge";
import { ShippingCharge } from "@/types/order/order.interface";
import { Label } from "@/components/ui/label";
import BdAddress from "@/lib/bdAddress";

type TProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  control: Control<T>;
  setValue: (name: Path<T>, value: string) => void;
  shipping: T["shipping"] | undefined;
  shippingCharge: ShippingCharge | undefined;
  errors: FieldErrors<T>;
  lang?: "en" | "bn";
  showDivision?: boolean;
};

const DivisionDistrictUpazilaSelector = <T extends FieldValues>({
  control,
  setValue,
  shipping,
  shippingCharge,
  errors,
  lang = "bn",
  showDivision = true,
}: TProps<T>) => {
  const { data: shippingCharges, isLoading } = useGetShippingChargeQuery({});

  const division =
    useWatch({ control, name: "shipping.division" as Path<T> }) || "";
  const district =
    useWatch({ control, name: "shipping.district" as Path<T> }) || "";
  const upazila =
    useWatch({ control, name: "shipping.upazila" as Path<T> }) || "";
  const selectedCharge =
    useWatch({ control, name: "shippingCharge" as Path<T> }) || "";

  const divisions = BdAddress.divisions(lang);
  const districts = showDivision
    ? BdAddress.districts(division, lang)
    : BdAddress.allDistricts();
  const upazilas = BdAddress.upazilas(district, lang);

  useEffect(() => {
    if (shipping?.division)
      setValue("shipping.division" as Path<T>, shipping.division);
    if (shipping?.district)
      setValue("shipping.district" as Path<T>, shipping.district);
    if (shipping?.upazila)
      setValue("shipping.upazila" as Path<T>, shipping.upazila);
    if (shippingCharge?._id)
      setValue("shippingCharge" as Path<T>, shippingCharge._id);
  }, [shipping, shippingCharge, setValue]);

  return (
    <div
      className={`grid ${showDivision ? "grid-cols-4" : "grid-cols-3"} gap-5 mt-4`}
    >
      {showDivision && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="division">Division</Label>
          <select
            id="division"
            value={division}
            onChange={(e) => {
              setValue("shipping.division" as Path<T>, e.target.value);
              setValue("shipping.district" as Path<T>, ""); // Reset dependent
              setValue("shipping.upazila" as Path<T>, "");
            }}
            className="w-full h-9 border border-primary outline-primary rounded-md"
          >
            <option value="">-- Select Division --</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="district">District</Label>
        <select
          id="district"
          value={district}
          onChange={(e) => {
            setValue("shipping.district" as Path<T>, e.target.value);
            setValue("shipping.upazila" as Path<T>, "");
          }}
          disabled={showDivision && !division}
          className="w-full h-9 border border-primary outline-primary rounded-md"
        >
          <option value="">
            --{" "}
            {showDivision && !division
              ? "Select Division First"
              : "Select District"}{" "}
            --
          </option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="upazila">Upazila</Label>
        <select
          id="upazila"
          value={upazila}
          onChange={(e) =>
            setValue("shipping.upazila" as Path<T>, e.target.value)
          }
          disabled={!district}
          className="w-full h-9 border border-primary outline-primary rounded-md"
        >
          <option value="">
            -- {district ? "Select Upazila" : "Select District First"} --
          </option>
          {upazilas.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <Label htmlFor="cost">
          Shipping Cost <span className="text-red-600">*</span>
        </Label>
        {!isLoading ? (
          <select
            value={selectedCharge}
            onChange={(e) =>
              setValue("shippingCharge" as Path<T>, e.target.value)
            }
            className="w-full h-9 border border-primary outline-primary rounded-md"
          >
            <option value="">-- Select Shipping Charge --</option>
            {shippingCharges?.data?.map(
              ({ _id, name, amount }: ShippingCharge) => (
                <option key={_id} value={_id}>
                  {`${name} ৳ ${amount}`}
                </option>
              )
            )}
          </select>
        ) : (
          <p>Loading...</p>
        )}

        {errors.shippingCharge?.message && (
          <p className="text-red-600">
            {errors.shippingCharge.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default DivisionDistrictUpazilaSelector;
