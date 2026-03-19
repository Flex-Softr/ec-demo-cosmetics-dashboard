"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  useBulkSchedulePickupMutation,
  useGetShippingMethodsForOrderQuery,
} from "@/redux/features/orders/ordersApi";
import { TCourier } from "@/types/shippingMethod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Package, Truck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BulkSchedulePickupSchema = z.object({
  order_ids: z.array(z.string()).min(1, "Select at least one order"),
  shipping_method_id: z.string({
    required_error: "Please select a courier provider",
  }),
});

type TBulkSchedulePickupForm = z.infer<typeof BulkSchedulePickupSchema>;

const BulkSchedulePickup = ({
  handleOpen,
  open,
  orderIds,
}: {
  handleOpen: () => void;
  open: boolean;
  orderIds: string[];
}) => {
  const { data: shippingMethodsRes } = useGetShippingMethodsForOrderQuery();
  const [bulkSchedulePickup, { isLoading }] = useBulkSchedulePickupMutation();

  const shippingMethods = useMemo(
    () => (shippingMethodsRes as { data: TCourier[] })?.data ?? [],
    [shippingMethodsRes]
  );

  const form = useForm<TBulkSchedulePickupForm>({
    resolver: zodResolver(BulkSchedulePickupSchema),
    defaultValues: {
      order_ids: orderIds,
      shipping_method_id: undefined,
    },
  });

  const { handleSubmit, setValue, watch, reset } = form;
  const shippingMethodId = watch("shipping_method_id");

  useEffect(() => {
    if (open) {
      setValue("order_ids", orderIds);
    } else {
      reset();
    }
  }, [open, orderIds, setValue, reset]);

  const selectedProvider = useMemo(
    () => shippingMethods.find((m) => m._id === shippingMethodId),
    [shippingMethodId, shippingMethods]
  );

  const onSubmit = async (values: TBulkSchedulePickupForm) => {
    if (selectedProvider?.slug !== "steadfast") {
      toast({
        title: "Bulk pickup is currently only supported for Steadfast.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await bulkSchedulePickup(values).unwrap();
      if (res.success) {
        toast({ title: "Bulk pickup scheduled successfully" });
        handleOpen();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: error?.data?.message || "Failed to schedule bulk pickup",
        variant: "destructive",
      });
    }
  };

  return (
    <CommonModal
      handleOpen={handleOpen}
      open={open}
      modalTitle={`Bulk Schedule Pickup (${orderIds.length} orders)`}
      className="w-full md:w-[50%] h-fit max-h-[90vh]"
    >
      <div className="p-1">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="text-md font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Courier Provider
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shippingMethods
                  .filter((m) => m.slug === "steadfast")
                  .map((method) => {
                    const isActive = shippingMethodId === method._id;
                    return (
                      <div
                        key={method._id}
                        className={`
                        relative cursor-pointer rounded-lg border p-3 transition-all duration-200
                        ${
                          isActive
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-gray-300 bg-card hover:border-primary/40 hover:bg-accent/50"
                        }
                      `}
                        onClick={() =>
                          setValue("shipping_method_id", method._id, {
                            shouldValidate: true,
                          })
                        }
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div
                            className={`
                          p-2 rounded-full 
                          ${isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"}
                        `}
                          >
                            <Truck className="h-5 w-5" />
                          </div>
                          <span
                            className={`font-bold text-sm tracking-tight text-center ${isActive ? "text-primary" : "text-foreground"}`}
                          >
                            {method.name}
                          </span>
                        </div>
                        {isActive && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              {form.formState.errors.shipping_method_id && (
                <p className="font-medium text-destructive text-sm">
                  {form.formState.errors.shipping_method_id.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Separator />
              <div className="flex items-center justify-end">
                <Button
                  type="submit"
                  size="default"
                  className="px-8 font-semibold shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 animate-spin" />
                      Scheduling...
                    </div>
                  ) : (
                    <span className="text-sm">Schedule Bulk Pickup</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </CommonModal>
  );
};

export default BulkSchedulePickup;
