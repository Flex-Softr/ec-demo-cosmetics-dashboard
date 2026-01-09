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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAddSliderMutation } from "@/redux/features/sliderBanner/sliderApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SliderSectionMedia from "./SliderSectionMedia";

type TAddBannerForm = {
  name?: string;
  image?: string;
  bannerLink?: string;
  sortOrder: string;
};

const AddSlider = () => {
  const [addSlider] = useAddSliderMutation();
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);

  const dispatch = useAppDispatch();

  const formSchema = z.object({
    name: z.string().optional(),
    sortOrder: z.string().min(1, { message: "Sort Order is required" }),
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
    image: z.string().min(1, { message: "Slider Image is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bannerLink: "",
      image: "",
      sortOrder: "",
    },
  });

  /* sync thumbnail to form state */
  const { setValue, clearErrors } = form;
  useEffect(() => {
    if (thumbnail) {
      setValue("image", thumbnail);
      clearErrors("image");
    }
  }, [thumbnail, setValue, clearErrors]);

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: TAddBannerForm) => {
    try {
      const payload = {
        ...data,
        image: thumbnail || undefined,
        sortOrder: Number(data.sortOrder),
      };
      const addedSlider = await addSlider(payload).unwrap();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // console.log(err);
      toast({
        variant: "destructive",
        title: err?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Slider</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Add Slider</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new slider
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full px-2">
              <div className="flex gap-4 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Banner Name (Optional)" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem className="w-48">
                      <FormLabel>Sort Order</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Order" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <SliderSectionMedia />
                          <Input
                            className="hidden"
                            placeholder="Image"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full space-y-4 items-start mt-4">
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

                <div className="flex justify-end">
                  <Button type="submit">Add Slider</Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSlider;
