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
import { useAddSubCategoryMutation } from "@/redux/features/category/subCategoryApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddCategoryMedia from "../../components/AddCategoryMedia";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Subcategory Name must be at least 2 characters.",
  }),
  image: z.string().optional(),
  category: z.string(),
});

type TSubCategoryForm = {
  name: string;
  category: string;
  image?: string;
};

const AddSubCategoryForm = ({ category }: { category: string }) => {
  const [addSubCategory] = useAddSubCategoryMutation();
  const dispatch = useAppDispatch();
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
      category: "",
    },
  });

  useEffect(() => {
    dispatch(setThumbnail(""));
  }, [dispatch]);

  const onSubmit = async (data: TSubCategoryForm) => {
    try {
      if (category) {
        data.category = category;
        data.image = thumbnail || undefined;

        const addedSubCategory = await addSubCategory(data).unwrap();

        if (addedSubCategory?.success) {
          await refetchData("categories");
          await refetchData("subcategories");
          form.reset();
          dispatch(setThumbnail(""));
          toast({
            className: "bg-success text-white text-2xl",
            title: addedSubCategory?.message,
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title:
          error?.data?.errorMessages?.[0]?.message ||
          "Something went wrong. Please try again later.",
        variant: "destructive",
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
                <Input placeholder="Sub Category Name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <AddCategoryMedia />

          <div className="flex gap-3 items-center">
            <Button type="submit" className="">
              Add Sub Category
            </Button>
            <Button
              type="reset"
              className="bg-transparent border border-red-100 text-black hover:bg-red-500 hover:text-white"
              onClick={() => handleReset()}
            >
              Reset
            </Button>
          </div>
          <div></div>
        </form>
      </Form>
    </div>
  );
};

export default AddSubCategoryForm;
