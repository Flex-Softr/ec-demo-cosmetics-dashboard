import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUpdateAttributeMutation } from "@/redux/features/addAttributes/attributesApi";
import { useForm } from "react-hook-form";
import { TAttributeValueItem } from "../lib/attribute.interface";
import { refetchData } from "@/utilities/fetchData";

type TAttributeValueForm = {
  value: string[];
};

const AddNewAttributeValue = ({ attributeId }: { attributeId: string }) => {
  const [updateAttribute] = useUpdateAttributeMutation();

  const resolver = async (values: TAttributeValueForm) => {
    return {
      values: values.value ? values : {},
      errors: !values.value
        ? {
            value: {
              type: "required",
              message: "This is required.",
            },
          }
        : {},
    };
  };

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TAttributeValueForm>({ resolver });

  //handle onsubmit

  const onSubmit = async (data: TAttributeValueForm) => {
    const formattedValues: TAttributeValueItem[] = data?.value?.map((x) => ({
      name: x,
    }));

    const attributeValueData = {
      attributeId: attributeId,
      values: formattedValues,
    };

    const res = await updateAttribute(attributeValueData).unwrap();
    if (res?.success) {
      refetchData("attributes");
      reset();
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
    } else {
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
    }
  };

  const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValues = e.target.value.split(",").map((value) => value.trim());
    setValue("value", inputValues);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3 items-center ">
          <Input
            type="text"
            placeholder="Enter Multiple Value | Ex: green,Blue,white"
            className="col-span-3"
            onChange={handleValuesChange}
          />

          <Button type="submit">Add</Button>
        </div>
        {errors.value && (
          <span className="text-red-500">{errors.value.message}</span>
        )}
      </form>
    </>
  );
};

export default AddNewAttributeValue;
