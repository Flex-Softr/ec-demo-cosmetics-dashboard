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
import { useUpdateSliderMutation } from "@/redux/features/sliderBanner/sliderApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { revalidateTag } from "@/utilities/revalidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TSlider } from "./SliderMediaTable";
import SliderSectionMedia from "./SliderSectionMedia";

type TUpdateBannerForm = {
  name?: string;
  image?: string;
  bannerLink?: string;
  sortOrder: string;
};

const UpdateSlider = ({ slider }: { slider: TSlider }) => {
  const [open, setOpen] = useState(false);
  const [updateSlider, { isLoading }] = useUpdateSliderMutation();
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
      name: slider.name,
      bannerLink: slider.bannerLink || "",
      image: slider.image?.src || "",
      sortOrder: slider.sortOrder?.toString() || "",
    },
  });

  // Pre-fill form when modal opens or slider changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: slider.name,
        bannerLink: slider.bannerLink || "",
        image: slider.image?.src || "",
        sortOrder: slider.sortOrder?.toString() || "",
      });
      // Also set the thumbnail in redux so the media selector shows the current image if possible,
      // or at least we should know clearly we are editing.
      // However, SliderSectionMedia relies on `thumbnail` from redux store to show preview.
      // If we want it to show the current image initially, we should dispatch it.
      if (slider.image?._id) {
        dispatch(setThumbnail(slider.image._id));
      }
    }
  }, [open, slider, dispatch, form]);

  /* sync thumbnail to form state */
  const { setValue, clearErrors } = form;
  useEffect(() => {
    if (thumbnail) {
      setValue("image", thumbnail);
      clearErrors("image");
    }
  }, [thumbnail, setValue, clearErrors]);

  const onSubmit = async (data: TUpdateBannerForm) => {
    const payload: Omit<Partial<TUpdateBannerForm>, "sortOrder"> & {
      sortOrder: number;
    } = {
      name: data.name,
      bannerLink: data.bannerLink,
      sortOrder: Number(data.sortOrder),
    };

    if (thumbnail) {
      payload.image = thumbnail;
    } else if (slider.image?._id) {
      // If no new thumbnail selected, ensure we preserve existing by not sending image
      // OR send existing ID if API requires it.
      // Usually PATCH means "update these fields". If we omit image, it shouldn't change.
      // But if we want to be explicit or if API replaces object:
      // payload.image = slider.image._id;
      // Let's assume sending undefined/omitting keeps current.
    }

    try {
      const res = await updateSlider({
        id: slider._id,
        data: payload,
      }).unwrap();

      if (res?.success) {
        setOpen(false);
        dispatch(setThumbnail(""));
        toast({
          className: "bg-success text-white text-2xl",
          title: res?.message,
        });
      }
      await revalidateTag("sliderBanner");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="!bg-white hover:!bg-gray-100"
        >
          <SquarePen className="h-4 w-4 text-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Update Slider</DialogTitle>
          <DialogDescription className="sr-only">
            Update Slider
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormItem className="w-32">
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

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
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
              {/* Only show "Keep existing" note if no new thumbnail selected? */}
              {!thumbnail && slider.image?.src && (
                <p className="text-xs text-muted-foreground">
                  Current image: {slider.image.src.split("/").pop()}
                </p>
              )}
            </div>

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
            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Slider"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSlider;
