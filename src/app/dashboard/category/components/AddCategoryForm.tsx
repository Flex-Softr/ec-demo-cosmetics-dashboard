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
import { useAddCategoryMutation } from "@/redux/features/category/categoryApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddCategoryMedia from "./AddCategoryMedia";

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

const AddCategoryForm = () => {
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);
  const dispatch = useAppDispatch();

  const [addCategory] = useAddCategoryMutation();

  useEffect(() => {
    dispatch(setThumbnail(""));
  }, [dispatch]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const onSubmit = async (data: TCategoryForm) => {
    data.image = thumbnail || undefined;
    const addedCategory = await addCategory(data).unwrap();
    if (addedCategory?.success) {
      await refetchData("categories");
      form.reset();
      dispatch(setThumbnail(""));

      toast({
        className: "bg-success text-white text-2xl",
        title: addedCategory?.message,
      });
    }
  };

  //handle Rest
  const handleReset = () => {
    form.reset();
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
                <Input placeholder="Category Name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <AddCategoryMedia />

          <div className="flex gap-10 items-center">
            <Button type="submit" className="">
              Add Category
            </Button>
            <Button
              type="reset"
              className="bg-transparent border border-red-100 text-black hover:bg-red-500 hover:text-white"
              onClick={() => handleReset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCategoryForm;
