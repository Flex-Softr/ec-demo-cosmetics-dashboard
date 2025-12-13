"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useUpdateBrandMutation } from "@/redux/features/brand/brandApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UpdateCategoryMedia from "./UpdateBrandMedia";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category Name must be at least 2 characters.",
  }),
  logo: z.string().optional(),
  description: z.string().optional(),
});

type TBrandForm = {
  name: string;
  logo?: string;
  description?: string;
};
type TBrandImage = {
  src: string;
  alt: string;
};
const UpdateBrandForm = ({
  id,
  name,
  description,
  logo,
  handleOpen,
}: {
  id: string;
  name: string;
  description: string;
  logo: TBrandImage;
  handleOpen: (open: boolean) => void;
}) => {
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);
  const dispatch = useAppDispatch();
  const [updateBrand] = useUpdateBrandMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      description,
      logo: "",
    },
  });

  const onSubmit = async (data: TBrandForm) => {
    data.logo = thumbnail || undefined;

    const updatedCategory = await updateBrand({ id, data }).unwrap();

    if (updatedCategory?.success) {
      form.reset();
      await refetchData("brands");
      dispatch(setThumbnail(""));
      toast({
        className: "bg-success text-white text-2xl",
        title: updatedCategory?.message,
      });
      handleClose();
      handleOpen(false);
    }
  };

  //handle close button for remove setThumbnail in thumbnail select slice
  const handleClose = () => {
    dispatch(setThumbnail(""));
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Textarea {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <UpdateCategoryMedia image={logo} />
          <div>
            <Button type="submit">Update Brand</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateBrandForm;
