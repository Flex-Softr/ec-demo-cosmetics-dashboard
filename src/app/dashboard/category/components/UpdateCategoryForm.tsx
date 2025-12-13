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
import { toast } from "@/components/ui/use-toast";
import { useUpdateCategoryMutation } from "@/redux/features/category/categoryApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UpdateCategoryMedia from "./UpdateCategoryMedia";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category Name must be at least 2 characters.",
  }),
  image: z.string().optional(),
  category: z.string().optional(),
});

type TCategoryForm = {
  name: string;
  image?: string;
};
type TCategoryImage = {
  src: string;
  alt: string;
};
const UpdateCategoryForm = ({
  id,
  name,
  image,
  handleOpen,
}: {
  id: string;
  name: string;
  image: TCategoryImage;
  handleOpen: (open: boolean) => void;
}) => {
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);
  const dispatch = useAppDispatch();

  const [updateCategory] = useUpdateCategoryMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      image: "",
    },
  });

  //handle close button for remove setThumbnail in thumbnail select slice
  const handleClose = () => {
    dispatch(setThumbnail(""));
  };
  const onSubmit = async (data: TCategoryForm) => {
    data.image = thumbnail || undefined;

    const updatedCategory = await updateCategory({ id, data }).unwrap();
    if (updatedCategory?.success) {
      form.reset();
      await refetchData("categories");
      dispatch(setThumbnail(""));
      toast({
        className: "bg-success text-white text-2xl",
        title: updatedCategory?.message,
      });
      handleOpen(false);
      handleClose();
    }
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

          <UpdateCategoryMedia image={image} />

          <div className="flex gap-3 items-center">
            <Button type="submit" className="">
              Update Category
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateCategoryForm;
