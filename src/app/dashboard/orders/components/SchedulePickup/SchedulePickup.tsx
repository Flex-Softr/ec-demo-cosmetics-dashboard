"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import {
  useGetShippingMethodsForOrderQuery,
  useSchedulePickupMutation,
} from "@/redux/features/orders/ordersApi";
import { useGetRedXShippingAreaQuery } from "@/redux/features/shippingMethod/shippingMethodApi";
import { TOrders } from "@/types/order.interface";
import { TCourier } from "@/types/shippingMethod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRight,
  DollarSign,
  Info,
  MapPin,
  Package,
  Store,
  Truck,
  Weight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Path, useForm } from "react-hook-form";

import {
  SchedulePickupSchema,
  TSchedulePickupForm,
} from "../SchedulePickupSchema";

const SchedulePickup = ({
  handleOpen,
  open,
  order,
}: {
  handleOpen: () => void;
  open: boolean;
  order: TOrders;
}) => {
  /* ---------------------------------- DATA --------------------------------- */
  const { data: shippingMethodsRes } = useGetShippingMethodsForOrderQuery();

  const [fetchRedxArea, setFetchRedxArea] = useState(false);

  const { data: shippingAreaRes } = useGetRedXShippingAreaQuery(undefined, {
    skip: !fetchRedxArea,
  });
  const shippingArea = useMemo(
    () => shippingAreaRes?.data ?? [],
    [shippingAreaRes?.data]
  );

  const shippingMethods = useMemo(
    () => (shippingMethodsRes as { data: TCourier[] })?.data ?? [],
    [shippingMethodsRes]
  );

  const [schedulePickup, { isLoading }] = useSchedulePickupMutation();

  const [selectedProvider, setSelectedProvider] = useState<TCourier | null>(
    null
  );

  useEffect(() => {
    const isRedxActive = shippingMethods.find(
      (item) => item.slug === "redx"
    )?.isActive;
    if (isRedxActive) {
      setFetchRedxArea(isRedxActive);
    }
  }, [shippingMethods]);

  /* ---------------------------------- FORM --------------------------------- */
  const form = useForm<TSchedulePickupForm>({
    resolver: zodResolver(SchedulePickupSchema),
    defaultValues: {
      order_id: order._id,
      shipping_method_id: undefined,
      delivery_area: "",
      delivery_area_id: undefined,
      parcel_weight: "",
      value: order?.total?.toString(),
      item_quantity: order?.products?.reduce((acc, p) => acc + p.quantity, 0),
      store_id: undefined,
    },
  });

  const { control, handleSubmit, setValue, watch, reset, setError } = form;

  const deliveryAreaId = watch("delivery_area_id");
  const shippingMethodId = watch("shipping_method_id");

  /* ------------------------------ SIDE EFFECTS ------------------------------ */

  // Set delivery area name
  useEffect(() => {
    if (deliveryAreaId && shippingArea.length) {
      const area = shippingArea.find((item) => item.id === deliveryAreaId);
      if (area) {
        setValue("delivery_area", area.name);
      }
    }
  }, [deliveryAreaId, shippingArea, setValue]);

  // Reset modal
  useEffect(() => {
    if (!open) {
      reset();
      setSelectedProvider(null);
    } else {
      setValue("order_id", order._id);
    }
  }, [open, order._id, reset, setValue]);

  // Update selected provider
  useEffect(() => {
    const method = shippingMethods.find((m) => m._id === shippingMethodId);
    setSelectedProvider(method ?? null);
  }, [shippingMethodId, shippingMethods]);

  /* -------------------------------- SUBMIT --------------------------------- */
  const onSubmit = async (values: TSchedulePickupForm) => {
    if (order.status !== "processing done") {
      toast({
        title: 'Only "processing done" orders can be scheduled for pickup.',
        variant: "destructive",
      });
      return;
    }

    try {
      await schedulePickup(values).unwrap();
      toast({ title: "Pickup scheduled successfully" });
      handleOpen();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const fieldErrors = error?.data?.errors || {};
      toast({
        title: error?.data?.message || "Failed to schedule pickup",
        variant: "destructive",
      });

      Object.entries(fieldErrors).forEach(([path, messages]) => {
        setError(path as Path<TSchedulePickupForm>, {
          type: "server",
          message: (messages as string[])[0],
        });
      });
    }
  };

  return (
    <CommonModal
      handleOpen={handleOpen}
      open={open}
      modalTitle={`Schedule pickup - ${order.orderId}`}
      className="w-full md:w-[60%] h-fit max-h-[90vh]"
    >
      <div className="p-1">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            {/* STEP 1: SELECT PROVIDER */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="text-md font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Courier Provider
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shippingMethods.map((method) => {
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
                <p className="font-medium text-destructive">
                  {form.formState.errors.shipping_method_id.message}
                </p>
              )}
            </div>

            {selectedProvider && (
              <div className="space-y-6">
                {/* STEP 2: PACKAGE INFORMATION */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <h3 className="text-md font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Package Details
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-start gap-4 bg-muted/20 p-3 rounded-lg border border-muted/50">
                    {/* WEIGHT */}
                    {["pathao", "redx"].includes(
                      selectedProvider?.slug ?? ""
                    ) && (
                      <FormField
                        control={control}
                        name="parcel_weight"
                        render={({ field }) => (
                          <FormItem className="space-y-1 flex-1 min-w-[120px]">
                            <FormLabel className="text-sm flex items-center gap-1.5">
                              <Weight className="h-4 w-4 text-primary" />
                              Weight (gm)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="h-10 pl-9 text-sm bg-background"
                                  placeholder="500"
                                />
                                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* VALUE (REDX ONLY) */}
                    {selectedProvider?.slug === "redx" && (
                      <FormField
                        control={control}
                        name="value"
                        render={({ field }) => (
                          <FormItem className="space-y-1 flex-1 min-w-[120px]">
                            <FormLabel className="text-sm flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-primary" />
                              Value
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="h-10 pl-9 text-sm bg-background"
                                  placeholder="Value"
                                />
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* DELIVERY AREA (REDX ONLY) */}
                    {selectedProvider?.slug === "redx" && (
                      <FormField
                        control={control}
                        name="delivery_area_id"
                        render={({ field }) => (
                          <FormItem className="space-y-1 flex-[2] min-w-[200px]">
                            <FormLabel className="text-sm flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-primary" />
                              Delivery Area
                            </FormLabel>
                            <Select
                              value={field?.value?.toString() ?? ""}
                              onValueChange={(v) => field.onChange(Number(v))}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 text-sm bg-background">
                                  <SelectValue placeholder="Select area..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {shippingArea.map((area) => (
                                  <SelectItem
                                    key={area.id}
                                    value={area?.id?.toString()}
                                    className="text-sm"
                                  >
                                    {area.name} ({area.district_name})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* ITEM QUANTITY (PATHAO ONLY) */}
                    {selectedProvider?.slug === "pathao" && (
                      <FormField
                        control={control}
                        name="item_quantity"
                        render={({ field }) => (
                          <FormItem className="space-y-1 flex-1 min-w-[120px]">
                            <FormLabel className="text-sm flex items-center gap-1.5">
                              <Package className="h-4 w-4 text-primary" />
                              Quantity
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  className="h-10 pl-9 text-sm bg-background"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* STORE ID (PATHAO ONLY) */}
                    {selectedProvider?.slug === "pathao" && (
                      <FormField
                        control={control}
                        name="store_id"
                        render={({ field }) => (
                          <FormItem className="space-y-1 flex-1 min-w-[120px]">
                            <FormLabel className="text-sm flex items-center gap-1.5">
                              <Store className="h-4 w-4 text-primary" />
                              Store ID
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      Merchant store identifier
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  className="h-10 pl-9 text-sm bg-background"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Separator />
              <div className="flex items-center justify-between">
                {order.status !== "processing done" ? (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    Status must be &quot;processing done&quot;
                  </p>
                ) : (
                  <div />
                )}
                <Button
                  type="submit"
                  size="default"
                  className="px-3 font-semibold shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
                  disabled={order.status !== "processing done" || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 animate-spin" />
                      Scheduling...
                    </div>
                  ) : (
                    <span className="text-sm">Schedule Pickup</span>
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

export default SchedulePickup;
