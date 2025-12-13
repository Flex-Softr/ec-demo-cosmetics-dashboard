"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAddAttributeMutation } from "@/redux/features/addAttributes/attributesApi";
import { useForm } from "react-hook-form";
import {
  TAttributeForm,
  TAttributeValueItem,
} from "../lib/attribute.interface";

import { Label } from "@/components/ui/label";
import { refetchData } from "@/utilities/fetchData";

// Custom validation resolver
const resolver = async (values: TAttributeForm) => {
  const errors: Record<string, unknown> = {};

  // Check if name is present
  if (!values.name) {
    errors.name = {
      type: "required",
      message: "Name is required.",
    };
  }

  // Check if at least one value is provided
  if (!values.values || values.values.length === 0) {
    errors.values = {
      type: "required",
      message: "At least one value is required.",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

const AddAttribute = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TAttributeForm>({ resolver });

  const [addAttributes] = useAddAttributeMutation();

  const onSubmit = async (data: TAttributeForm) => {
    // Formatting values into the structure required for the API
    const formattedValues: TAttributeValueItem[] = data.values?.map(
      (value) => ({
        name: value,
      })
    );

    try {
      const addedAttribute = await addAttributes({
        name: data.name,
        values: formattedValues,
      }).unwrap();

      if (addedAttribute) {
        refetchData("attributes");
        reset();
        toast({
          className: "bg-success text-white",
          title: addedAttribute?.message,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        className: "bg-error text-white",
        title: "Failed to add attribute",
        description: error?.message || "An error occurred",
      });
    }
  };

  // Handle values input change by splitting the values by commas
  const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValues = e.target.value.split(",").map((value) => value.trim());
    setValue("values", inputValues, { shouldValidate: true });
  };

  return (
    <div className="w-full">
      <div className="">
        <Card className="p-4 shadow-none rounded-xl space-y-5">
          <h2 className="text-xl font-bold">Add New Attribute</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder="Enter Attribute Name"
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="values">Attribute Values</Label>
                <Input
                  id="values"
                  type="text"
                  placeholder="Ex: Red, Green, Blue"
                  onChange={handleValuesChange}
                />
                {errors.values && (
                  <span className="text-red-500">{errors.values.message}</span>
                )}
              </div>

              <div>
                <Button size="sm" type="submit">
                  Add Attribute
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddAttribute;
