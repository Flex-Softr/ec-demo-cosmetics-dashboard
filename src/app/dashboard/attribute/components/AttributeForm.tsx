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
  useAddAttributeMutation,
  useUpdateAttributeMutation,
} from "@/redux/features/attributes/attributesApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TAttribute, TAttributeValueItem } from "../lib/attribute.interface";

type AttributeFormProps = {
  initialData?: TAttribute;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const AttributeForm = ({
  initialData,
  open: controlledOpen,
  setOpen: setControlledOpen,
  trigger,
}: AttributeFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const [addAttribute, { isLoading: isCreating }] = useAddAttributeMutation();
  const [updateAttribute, { isLoading: isUpdating }] =
    useUpdateAttributeMutation();

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    isActive: z.boolean().default(true),
    values: z
      .string()
      .optional()
      .refine((val) => {
        if (!initialData && (!val || val.trim() === "")) return false;
        return true;
      }, "At least one value is required for new attributes"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      isActive: initialData?.isActive ?? true,
      values: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          isActive: initialData.isActive,
          values: "",
        });
      } else {
        form.reset({
          name: "",
          isActive: true,
          values: "",
        });
      }
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let res;
      if (initialData) {
        // Update
        res = await updateAttribute({
          id: initialData._id,
          data: {
            name: values.name,
            isActive: values.isActive,
          },
        }).unwrap();
      } else {
        // Create
        const formattedValues: TAttributeValueItem[] = (values.values || "")
          .split(",")
          .map((v) => ({ name: v.trim() }))
          .filter((v) => v.name !== "");

        res = await addAttribute({
          name: values.name,
          isActive: values.isActive,
          values: formattedValues,
        }).unwrap();
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Attribute" : "Add New Attribute"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the attribute name and status."
              : "Create a new attribute and assign default values."}
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
                  <Input placeholder="Enter Attribute Name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {!initialData && (
              <FormField
                control={form.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attribute Values</FormLabel>
                    <Input placeholder="Ex: Red, Green, Blue" {...field} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separate multiple values with commas (e.g., Small, Medium,
                      Large)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <div className="flex justify-end gap-5 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {initialData
                  ? isUpdating
                    ? "Updating..."
                    : "Update"
                  : isCreating
                    ? "Adding..."
                    : "Add Attribute"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AttributeForm;
