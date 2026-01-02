"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";

const Advanced = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();
  const warranty = watch("warranty");

  const getError = (path: string) => {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;
    for (const p of parts) {
      if (current?.[p]) current = current[p];
      else return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (current as any)?.message as string | undefined;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="w-40" htmlFor="featured">
          Featured
        </Label>
        <div>
          <Input type="checkbox" {...register("featured")} id="featured" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="w-40" htmlFor="warranty">
          Warranty
        </Label>
        <div>
          <Input type="checkbox" {...register("warranty")} id="warranty" />
        </div>
      </div>
      {warranty && (
        <>
          <div className="flex items-center gap-3 mb-3">
            <Label className="w-40" htmlFor="warrantyDuration">
              Warranty duration
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={0}
                  {...register("warrantyInfo.duration.quantity")}
                  placeholder="0"
                  className="w-16 px-1 text-center"
                />
                <Controller
                  name="warrantyInfo.duration.unit"
                  control={control}
                  defaultValue="select"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "select"}
                    >
                      <SelectTrigger className="w-[120px] border-primary focus:ring-0">
                        <SelectValue placeholder={"select"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex gap-4">
                {getError("warrantyInfo.duration.quantity") && (
                  <p className="text-red-500 text-sm">
                    {getError("warrantyInfo.duration.quantity")}
                  </p>
                )}
                {getError("warrantyInfo.duration.unit") && (
                  <p className="text-red-500 text-sm">
                    {getError("warrantyInfo.duration.unit")}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 pt-3">
            <Label className="w-40 mt-2" htmlFor="terms">
              Terms
            </Label>
            <div className="w-full space-y-1">
              <Textarea
                placeholder="Type warranty terms here."
                {...register("warrantyInfo.terms")}
                id="terms"
                className="min-h-10 border border-primary focus-visible:ring-primary w-full"
              />
              {getError("warrantyInfo.terms") && (
                <p className="text-red-500 text-sm">
                  {getError("warrantyInfo.terms")}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Advanced;
