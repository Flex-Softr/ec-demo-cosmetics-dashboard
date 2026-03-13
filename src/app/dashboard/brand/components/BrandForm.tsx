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
  useAddBrandMutation,
  useUpdateBrandMutation,
} from "@/redux/features/brand/brandApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { revalidateTag } from "@/utilities/revalidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TBrand } from "../lib/brand.interface";
import BrandImage from "./BrandImage";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().optional().default(0),
});

type BrandFormProps = {
  initialData?: TBrand;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const BrandForm = ({
  initialData,
  open: controlledOpen,
  setOpen: setControlledOpen,
  trigger,
}: BrandFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);
  const dispatch = useAppDispatch();

  const [addBrand, { isLoading: isCreating }] = useAddBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      logo: initialData?.logo?.src || "",
      isActive: initialData?.isActive ?? true,
      sortOrder: initialData?.sortOrder || 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          description: initialData.description || "",
          logo: initialData.logo?.src || "",
          isActive: initialData.isActive,
          sortOrder: initialData.sortOrder || 0,
        });
        if (initialData.logo?._id) {
          dispatch(setThumbnail(initialData.logo._id));
        }
      } else {
        form.reset({
          name: "",
          description: "",
          logo: "",
          isActive: true,
          sortOrder: 0,
        });
        dispatch(setThumbnail(""));
      }
    }
  }, [isOpen, initialData, form, dispatch]);

  useEffect(() => {
    if (thumbnail) {
      form.setValue("logo", thumbnail);
    }
  }, [thumbnail, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const logoToSubmit = thumbnail || initialData?.logo?._id;

      const payload = {
        ...values,
        logo: logoToSubmit || undefined,
      };

      let res;
      if (initialData) {
        res = await updateBrand({
          id: initialData._id,
          data: payload,
        }).unwrap();
      } else {
        res = await addBrand(payload).unwrap();
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
        await revalidateTag(["brands"]);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Brand" : "Add Brand"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update brand details."
              : "Create a new product brand."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="shrink-0">
                <div className="flex flex-col gap-2">
                  <FormLabel>Brand Logo</FormLabel>
                  <BrandImage image={initialData?.logo} />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Apple" {...field} />
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
                      <Textarea placeholder="Brand description..." {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-10">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">
                        Active Status
                      </FormLabel>
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
            </div>

            <div className="flex justify-end gap-5 pt-4">
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

export default BrandForm;
