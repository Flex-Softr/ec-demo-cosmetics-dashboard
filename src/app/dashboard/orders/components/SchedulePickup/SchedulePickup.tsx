"use client";

import CommonModal from "@/components/modal/CommonModal";

import {
  useGetShippingMethodsForOrderQuery,
  useSchedulePickupMutation,
} from "@/redux/features/orders/ordersApi";
import { useGetRedXShippingAreaQuery } from "@/redux/features/shippingMethod/shippingMethodApi";
import { TOrders } from "@/types/order.interface";
import { TCourier } from "@/types/shippingMethod";

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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
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
      parcel_weight: "200",
      value: order?.total?.toString(),
      item_quantity: order?.products?.reduce((acc, p) => acc + p.quantity, 0),
      store_id: 1,
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
      className="w-full md:w-[60%] h-[90vh] overflow-y-auto"
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            {order.status !== "processing done" && (
              <p className="text-right text-sm text-red-600">
                Only orders with status{" "}
                <span className="font-medium">processing done</span> can be
                scheduled.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PROVIDER */}
              <div className="md:col-span-2">
                <FormField
                  control={control}
                  name="shipping_method_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select provider</FormLabel>
                      <Select
                        value={field?.value?.toString() ?? ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shippingMethods.map((method) => (
                            <SelectItem
                              key={method?._id}
                              value={method?._id?.toString()}
                            >
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* REDX AREA */}
              {selectedProvider?.slug === "redx" && (
                <FormField
                  control={control}
                  name="delivery_area_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Area</FormLabel>
                      <Select
                        value={field?.value?.toString() ?? ""}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shippingArea.map((area) => (
                            <SelectItem
                              key={area.id}
                              value={area?.id?.toString()}
                            >
                              {area.name} ({area.district_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* WEIGHT */}
              {["redx", "pathao"].includes(selectedProvider?.slug ?? "") && (
                <FormField
                  control={control}
                  name="parcel_weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcel Weight (gm)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* VALUE */}
              {selectedProvider?.slug === "redx" && (
                <FormField
                  control={control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* PATHAO */}
              {selectedProvider?.slug === "pathao" && (
                <>
                  <FormField
                    control={control}
                    name="item_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="store_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store ID</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Separator />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={order.status !== "processing done" || isLoading}
            >
              Schedule pickup
            </Button>
          </div>
        </form>
      </Form>
    </CommonModal>
  );
};

export default SchedulePickup;
