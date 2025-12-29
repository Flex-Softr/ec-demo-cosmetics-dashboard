"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAddSliderMutation } from "@/redux/features/sliderBanner/sliderApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SliderSectionMedia from "./SliderSectionMedia";

type TAddBannerForm = {
  name: string;
  image?: string;
  bannerLink?: string;
};

const AddSlider = () => {
  const [addSlider] = useAddSliderMutation();
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);

  const dispatch = useAppDispatch();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Banner Name must be at least 2 characters.",
    }),
    bannerLink: z
      .string()
      .optional()
      .refine(
        (value) =>
          value === undefined ||
          value === "" ||
          z.string().url().safeParse(value).success,
        {
          message: "Banner Link must be a valid URL or empty.",
        }
      ),
    image: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bannerLink: "",
      image: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: TAddBannerForm) => {
    data.image = thumbnail || undefined;
    const addedSlider = await addSlider(data).unwrap();
    if (addedSlider?.success) {
      await refetchData("sliders");
      form.reset();
      dispatch(setThumbnail(""));
      setOpen(false);

      toast({
        className: "bg-success text-white text-2xl",
        title: addedSlider?.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Slider</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Slider</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new slider
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" w-full px-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="Banner Name" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className="p-4 ">
                <SliderSectionMedia />
              </span>
              <div className="w-full space-y-2 items-start mt-4">
                <FormField
                  control={form.control}
                  name="bannerLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Link</FormLabel>
                      <Input type="url" placeholder="Banner Link" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Add Slider</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSlider;
