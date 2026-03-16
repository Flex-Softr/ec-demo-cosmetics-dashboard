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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
} from "@/redux/features/collection/collectionApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ICollection } from "@/types/collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CollectionImage from "./CollectionImage";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().optional().default(0),
});

type CollectionFormProps = {
  initialData?: ICollection;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const CollectionForm = ({
  initialData,
  open: controlledOpen,
  setOpen: setControlledOpen,
  trigger,
}: CollectionFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);
  const dispatch = useAppDispatch();

  const [createCollection, { isLoading: isCreating }] =
    useCreateCollectionMutation();
  const [updateCollection, { isLoading: isUpdating }] =
    useUpdateCollectionMutation();

  // Helper: Get image ID string
  const getImageId = (img: string | { _id: string } | undefined) => {
    if (!img) return "";
    return typeof img === "string" ? img : img._id;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      image: getImageId(initialData?.image),
      isActive: initialData?.isActive ?? true,
      sortOrder: initialData?.sortOrder || 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const imgId = getImageId(initialData.image);
        form.reset({
          name: initialData.name,
          slug: initialData.slug,
          image: imgId,
          isActive: initialData.isActive,
          sortOrder: initialData.sortOrder || 0,
        });
        if (imgId) {
          dispatch(setThumbnail(imgId));
        }
      } else {
        form.reset({
          name: "",
          slug: "",
          image: "",
          isActive: true,
          sortOrder: 0,
        });
        dispatch(setThumbnail(""));
      }
    }
  }, [isOpen, initialData, form, dispatch]);

  const displayedImage =
    initialData?.image && typeof initialData.image === "object"
      ? { src: initialData.image.src, alt: initialData.image.alt }
      : undefined;

  // Sync thumbnail from Redux
  useEffect(() => {
    if (thumbnail) {
      form.setValue("image", thumbnail);
    }
  }, [thumbnail, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Use current thumbnail from redux if available (user changed it), otherwise keep existing
      const imageToSubmit = thumbnail || values.image;

      const payload = {
        ...values,
        image: imageToSubmit || undefined,
      };

      let res;
      if (initialData) {
        res = await updateCollection({
          id: initialData._id,
          data: payload,
        }).unwrap();
      } else {
        res = await createCollection(payload).unwrap();
      }

      if (res?.success) {
        toast({
          className: "bg-success text-white",
          title:
            res.message ||
            (initialData ? "Updated successfully" : "Created successfully"),
        });
        setOpen(false);
        form.reset();
        dispatch(setThumbnail(""));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Collection" : "Add Collection"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update collection details."
              : "Create a new product collection."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="shrink-0">
                <div className="flex flex-col gap-2">
                  <FormLabel>Collection Image</FormLabel>
                  <CollectionImage image={displayedImage} />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Summer Sale" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <Input type="number" placeholder="0" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionForm;
