import { z } from "zod";

export const SchedulePickupSchema = z.object({
  order_id: z.string().optional(),
  shipping_method_id: z.string({
    required_error: "Please select a courier provider",
  }),
  delivery_area: z.string().optional(),
  delivery_area_id: z.number().optional(),
  parcel_weight: z.string().optional(),
  value: z.string().optional(),
  item_quantity: z.number().optional(),
  store_id: z.number().optional(),
});

export type TSchedulePickupForm = z.infer<typeof SchedulePickupSchema>;
