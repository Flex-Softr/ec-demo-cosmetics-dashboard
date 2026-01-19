export type TOrderSMSNotificationMediumType = "phone" | "email" | "whatsapp";

export type Message = {
  _id?: string | null;
  slug: string;
  status: string;
  isActive?: boolean;
  customTemplate?: string;
  defaultTemplate?: string;
  isUpdating?: boolean;
  activeMedium?: TOrderSMSNotificationMediumType[];
  emailSubject?: string;
};

export const statusList = [
  { slug: "order_created", status: "Pending" },
  { slug: "order_confirmed", status: "Confirm" },
  { slug: "order_canceled", status: "Cancel" },
  // { slug: "product_picked_by_courier", status: "Picked Up" },
  { slug: "shifted", status: "Shipped" },
  { slug: "courier_assigned", status: "Courier Assign" },
  // { slug: "Completed", status: "Delivered" },
  // { slug: "order_returned", status: "Return" },
];

export const notificationData = [
  {
    slug: "order_created",
    defaultTemplate: "Your order has been created successfully.",
  },
  {
    slug: "order_confirmed",
    defaultTemplate: "Your order has been confirmed.",
  },
  {
    slug: "order_canceled",
    defaultTemplate: "Your order has been canceled.",
  },
  {
    slug: "product_picked_by_courier",
    defaultTemplate: "Your product has been picked up by the courier.",
  },
  {
    slug: "shifted",
    defaultTemplate: "Your order has been shipped.",
  },
  {
    slug: "courier_assigned",
    defaultTemplate: "Your order has been courier_assigned.",
  },
  {
    slug: "order_completed",
    defaultTemplate: "Your order has been delivered.",
  },
  {
    slug: "order_returned",
    defaultTemplate: "Your order has been returned.",
  },
];

export const messageTemplate = (text: string, slug: string) => {
  const defaultTemple = (slug: string) => {
    const notification = notificationData.find((item) => item.slug === slug);
    return notification?.defaultTemplate || "";
  };

  return { customTemplate: text || "", defaultTemplate: defaultTemple(slug) };
};
