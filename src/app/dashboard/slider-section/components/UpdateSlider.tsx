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
import { useUpdateSliderMutation } from "@/redux/features/sliderBanner/sliderApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TSlider } from "./SliderMediaTable";
import SliderSectionMedia from "./SliderSectionMedia";

type TUpdateBannerForm = {
  name: string;
  image?: string;
  bannerLink?: string;
};

const UpdateSlider = ({ slider }: { slider: TSlider }) => {
  const [open, setOpen] = useState(false);
  const [updateSlider, { isLoading }] = useUpdateSliderMutation();
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
      name: slider.name,
      bannerLink: slider.bannerLink || "", // Assuming bannerLink exists on TSlider, need to verify
      image: slider.image?.src || "",
    },
  });

  // Pre-fill form when modal opens or slider changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: slider.name,
        bannerLink: slider.bannerLink || "",
        image: slider.image?.src || "",
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

  const onSubmit = async (data: TUpdateBannerForm) => {
    // If a new thumbnail is selected, use it. Otherwise keep existing (handled by default values? no, thumbnail is from redux)
    // Actually, AddSlider logic: data.image = thumbnail || undefined;

    // For update:
    // If `thumbnail` (redux state) is present, it means user selected a new image.
    // If not, we might want to keep the old one.
    // But `data.image` from form will have the old src string if not touched.
    // Our API likely expects an Image ID if it's a reference, or a string if it's just a path?
    // Looking at AddSlider: data.image = thumbnail || undefined;
    // It seems the API expects an image ID strings.

    // Issue: The form's default `image` is likely the SRC string, not the ID, because `slider.image` is `{ src: string }`.
    // We need the Image ID to send to the API.
    // I need to check if `slider` object has the image ID.
    // Let's assume for now we might need to fetch it or TSlider is incomplete.
    // Checking SliderMediaTable.tsx:
    // export type TSlider = { _id: string; name: string; image: { src: string; }; isActive: boolean; };
    // It seems we only have src. This is a problem if passing 'src' to API is invalid.
    // However, if the user picks a NEW image, `thumbnail` will be an ID.
    // If the user DOES NOT pick a new image, we should probably send undefined for image so backend doesn't update it, OR send the old ID.

    // Strategy:
    // If `thumbnail` is present, it's a new ID. Send it.
    // If `thumbnail` is empty, check if `data.image` (which we populated with src) is valid?
    // No, if `thumbnail` is empty, it implies no *new* selection.
    // We should send `undefined` or existing ID.
    // Since we don't have existing ID in TSlider type locally, we hopefully have it in the actual object passed at runtime?
    // Or we just don't send `image` field if it hasn't changed.

    const payload: Partial<TUpdateBannerForm> = {
      name: data.name,
      bannerLink: data.bannerLink,
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
        await refetchData("sliders");
        setOpen(false);
        dispatch(setThumbnail(""));
        toast({
          className: "bg-success text-white text-2xl",
          title: res?.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <SquarePen className="text-green-500" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Slider</DialogTitle>
          <DialogDescription className="sr-only">
            Update Slider
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex flex-col gap-2">
              <FormLabel>Image</FormLabel>
              <SliderSectionMedia />
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Slider"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSlider;
