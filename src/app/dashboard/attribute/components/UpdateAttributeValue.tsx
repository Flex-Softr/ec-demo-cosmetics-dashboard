import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  useDeleteAttributeMutation,
  useUpdateAttributeMutation,
} from "@/redux/features/addAttributes/attributesApi";
import { Save, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  TAttributeValueForm,
  TAttributeValueItem,
} from "../lib/attribute.interface";
import { refetchData } from "@/utilities/fetchData";

const UpdateAttributeValue = ({
  item,
  attributeId,
}: {
  item: TAttributeValueItem;
  attributeId: string;
}) => {
  const [updateAttribute] = useUpdateAttributeMutation();
  const [deleteAttribute] = useDeleteAttributeMutation();

  //Add attribute Value handler

  //delete attribute value
  const deleteAttributeValuehandler = async (attributeValueId: string) => {
    const res = await deleteAttribute({
      valueIds: [attributeValueId],
    }).unwrap();
    if (res?.success) {
      refetchData("attributes");
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

  const resolver = async (values: TAttributeValueForm) => {
    return {
      values: values.name ? values : {},
      errors: !values.name
        ? {
            name: {
              type: "required",
              message: "This is required.",
            },
          }
        : {},
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TAttributeValueForm>({ resolver });

  //handle onsubmit

  //update Attribute Value
  const onSubmit = async (data: TAttributeValueForm) => {
    const updatedData = {
      attributeId,
      values: [
        {
          _id: item?._id,
          name: data.name,
        },
      ],
    };

    const res = await updateAttribute(updatedData).unwrap();
    if (res?.success) {
      refetchData("attributes");
      reset();
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
    } else {
      toast({
        className: "bg-danger text-white text-2xl",
        title: res?.message,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div key={item._id} className="flex items-center gap-2">
          <Input
            {...register("name")}
            defaultValue={item?.name}
            className="col-span-3 "
          />

          <button type="submit">
            <Save className="cursor-pointer text-primary" />
          </button>

          <TrashIcon
            onClick={() => deleteAttributeValuehandler(item._id as string)}
            className="text-red-500 cursor-pointer"
          />
        </div>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </form>
    </div>
  );
};

export default UpdateAttributeValue;
