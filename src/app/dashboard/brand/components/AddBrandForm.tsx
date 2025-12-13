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
import { useAddBrandMutation } from "@/redux/features/brand/brandApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddBrandMedia from "./AddBrandMedia";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Brand Name must be at least 2 characters.",
  }),
  logo: z.string().optional(),
  description: z.string().optional(),
});

type TBrandForm = {
  name: string;
  description?: string;
  logo?: string;
};

const AddBrandForm = () => {
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);
  const dispatch = useAppDispatch();

  const [addBrand] = useAddBrandMutation();

  useEffect(() => {
    dispatch(setThumbnail(""));
  }, [dispatch]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
    },
  });

  const onSubmit = async (data: TBrandForm) => {
    data.logo = thumbnail || undefined;
    const addedBrand = await addBrand(data).unwrap();

    if (addedBrand?.success) {
      await refetchData("brands");
      form.reset();
      dispatch(setThumbnail(""));
      toast({
        className: "bg-success text-white text-2xl",
        title: addedBrand?.message,
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
                <Input placeholder="Enter brand name" {...field} />
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
                <Textarea placeholder="Enter brand description" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <AddBrandMedia />
          <div className="flex gap-10 items-center">
            <Button type="submit">Add Brand</Button>
            <Button
              type="reset"
              className="bg-transparent border border-red-100 hover:bg-red-500 hover:text-white"
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

export default AddBrandForm;
