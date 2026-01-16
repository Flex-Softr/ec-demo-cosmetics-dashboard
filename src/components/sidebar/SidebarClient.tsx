"use client";

// import config from "@/config/config";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProvider";
import {
  BarChart,
  CircleDollarSign,
  ClipboardList,
  Home,
  // Image as ImageIcon,
  LucideIcon,
  MapPinned,
  MessageSquareText,
  Package,
  RefreshCcw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  TicketPercent,
  Truck,
  User,
  UserCheck,
  UserCog,
  UsersRound,
} from "lucide-react";
import NavLink from "../NavLink/NavLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type TProps = {
  permissions: {
    isSuperAdmin: boolean;
    manageProduct: boolean;
    manageOrder: boolean;
    manageImgToOrder: boolean;
    manageProcessingOrder: boolean;
    manageShipmentOrder: boolean;
    manageAdminOrStaff: boolean;
    manageWarrantyClaim: boolean;
    manageCoupon: boolean;
    manageShippingCharge: boolean;
    manageCustomer: boolean;
    managePaymentMethod: boolean;
    manageCourier: boolean;
    sendSMS: boolean;
  };
};

type SidebarItem = {
  name: string;
  href?: string;
  icon?: LucideIcon;
};

type SidebarGroup = {
  key: string;
  label: string;
  icon: LucideIcon;
  items: SidebarItem[];
  visible: boolean;
};

export function SidebarClient({ permissions }: TProps) {
  const { isCollapsed } = useSidebar();

  const {
    isSuperAdmin,
    manageProduct,
    manageOrder,
    // manageImgToOrder,
    manageProcessingOrder,
    manageShipmentOrder,
    manageAdminOrStaff,
    manageWarrantyClaim,
    manageCoupon,
    manageShippingCharge,
    manageCustomer,
    managePaymentMethod,
    manageCourier,
    sendSMS,
  } = permissions;

  const productManagementLinks = [
    { href: "/products", name: "All Products" },
    { href: "/add-products", name: "Add Product" },
    { href: "/category", name: "Category" },
    { href: "/attribute", name: "Attribute" },
    { href: "/brand", name: "Brand" },
    { href: "/collection", name: "Collection" },
    { href: "/media", name: "Media" },
  ];

  const sidebarGroups: SidebarGroup[] = [
    {
      key: "products",
      label: "Products",
      icon: Package,
      visible: !!manageProduct,
      items: productManagementLinks.map((link) => ({
        name: link.name,
        href: `/dashboard${link.href}`,
      })),
    },
    {
      key: "orders",
      label: "Orders",
      icon: ClipboardList,
      visible: true,
      items: [
        manageOrder && { name: "Orders", href: "/dashboard/orders" },
        manageProcessingOrder && {
          name: "Processing Orders",
          href: "/dashboard/processing-orders",
        },
        manageShipmentOrder && {
          name: "Courier Shipments",
          href: "/dashboard/courier-shipment",
        },
        (manageCourier || manageProcessingOrder) && {
          name: "Monitor Delivery",
          href: "/dashboard/monitor-delivery",
        },
        // Boolean(config.next_public_show_image_to_order) === true &&
        //   manageImgToOrder && {
        //     name: "Image to order",
        //     href: "/dashboard/image-to-order",
        //   },
        manageWarrantyClaim && {
          name: "Warranty Claims",
          href: "/dashboard/warranty-claims",
          // icon: ShieldAlert,
        },
        (manageOrder ||
          manageProcessingOrder ||
          manageShipmentOrder ||
          isSuperAdmin) && {
          name: "Fraud Check",
          href: "/dashboard/fraud-check",
          // icon: ShieldCheck,
        },
      ].filter(Boolean) as SidebarItem[],
    },
    {
      key: "configuration",
      label: "Configuration",
      icon: Settings,
      visible: true,
      items: [
        (isSuperAdmin || manageProduct) && {
          name: "Slider Config",
          href: "/dashboard/slider-section",
        },
        manageShippingCharge && {
          name: "Shipping Charges",
          href: "/dashboard/manage-shipping-charges",
        },
        managePaymentMethod && {
          name: "Payment Config",
          href: "/dashboard/payment-configuration",
        },
        manageCourier && {
          name: "Courier Config",
          href: "/dashboard/courier-configuration",
        },
        manageAdminOrStaff && {
          name: "Manage Employees",
          href: "/dashboard/manage-admin-staff",
        },
      ].filter(Boolean) as SidebarItem[],
    },
    {
      key: "marketing",
      label: "Marketing",
      icon: TicketPercent,
      visible: !!(manageCoupon || sendSMS),
      items: [
        manageCoupon && {
          name: "Manage Coupons",
          href: "/dashboard/manage-coupon",
        },
        sendSMS && { name: "SMS", href: "/dashboard/sms" },
      ].filter(Boolean) as SidebarItem[],
    },
    {
      key: "customers",
      label: "Customers",
      icon: UsersRound,
      visible: !!manageCustomer,
      items: [
        { name: "Customer List", href: "/dashboard/customers" },
        {
          name: "Registered customers",
          href: "/dashboard/registered-customers",
        },
      ],
    },
  ];

  const getCollapsedItems = () => {
    const items: SidebarItem[] = [];

    if (manageProduct) {
      items.push({
        name: "",
        href: "/dashboard/products",
        icon: Package,
      });
    }

    if (manageOrder)
      items.push({ name: "", href: "/dashboard/orders", icon: ClipboardList });
    if (manageProcessingOrder)
      items.push({
        name: "",
        href: "/dashboard/processing-orders",
        icon: RefreshCcw,
      });
    if (manageShipmentOrder)
      items.push({
        name: "",
        href: "/dashboard/courier-shipment",
        icon: Truck,
      });
    if (manageCourier || manageProcessingOrder)
      items.push({
        name: "",
        href: "/dashboard/monitor-delivery",
        icon: MapPinned,
      });
    // if (Boolean(config.next_public_show_ito) === true && manageImgToOrder)
    //   items.push({
    //     name: "",
    //     href: "/dashboard/image-to-order",
    //     icon: ImageIcon,
    //   });
    if (manageWarrantyClaim)
      items.push({
        name: "",
        href: "/dashboard/warranty-claims",
        icon: ShieldAlert,
      });
    items.push({
      name: "",
      href: "/dashboard/fraud-check",
      icon: ShieldCheck,
    });

    if (manageShippingCharge)
      items.push({
        name: "",
        href: "/dashboard/manage-shipping-charges",
        icon: CircleDollarSign,
      });
    if (managePaymentMethod)
      items.push({
        name: "",
        href: "/dashboard/payment-configuration",
        icon: CircleDollarSign,
      });
    if (manageCourier)
      items.push({
        name: "",
        href: "/dashboard/courier-configuration",
        icon: Truck,
      });
    if (manageAdminOrStaff)
      items.push({
        name: "",
        href: "/dashboard/manage-admin-staff",
        icon: UserCog,
      });
    if (isSuperAdmin || manageProduct)
      items.push({
        name: "",
        href: "/dashboard/slider-section",
        icon: Settings,
      });

    if (manageCoupon)
      items.push({
        name: "",
        href: "/dashboard/manage-coupon",
        icon: TicketPercent,
      });
    if (sendSMS)
      items.push({
        name: "",
        href: "/dashboard/sms",
        icon: MessageSquareText,
      });

    if (manageCustomer) {
      items.push({
        name: "",
        href: "/dashboard/customers",
        icon: UsersRound,
      });
      items.push({
        name: "",
        href: "/dashboard/registered-customers",
        icon: UserCheck,
      });
    }

    return items;
  };

  return (
    <div
      className={cn(
        "bg-white text-gray-900 shadow-lg h-[calc(100vh-60px)] border-r overflow-y-auto transition-all duration-300 relative flex flex-col",
        isCollapsed ? "w-[60px]" : "min-w-64 w-64"
      )}
    >
      <div
        className={cn(
          "space-y-6 p-2 mb-4",
          isCollapsed ? "items-center flex flex-col space-y-2 p-1 w-full" : ""
        )}
      >
        <NavLink
          href="/dashboard"
          name={isCollapsed ? "" : "Home"}
          icon={<Home size={20} />}
          className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
        />
        {isSuperAdmin && (
          <NavLink
            href="/dashboard/reports"
            name={isCollapsed ? "" : "Reports"}
            icon={<BarChart size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}

        {isCollapsed ? (
          <div className="flex flex-col gap-2 w-full items-center">
            {getCollapsedItems().map((item, idx) => (
              <NavLink
                key={idx}
                href={item.href || "#"}
                name=""
                icon={item.icon ? <item.icon size={20} /> : undefined}
                className="justify-center w-full px-0 pl-2"
              />
            ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="!mt-0 w-full">
            {sidebarGroups
              .filter((group) => group.visible && group.items.length > 0)
              .map((group) => (
                <AccordionItem
                  key={group.key}
                  value={group.key}
                  className="border-none"
                >
                  <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:no-underline">
                    <div className="flex items-center gap-2">
                      <group.icon size={20} /> <span>{group.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="ml-8 pb-0 space-y-1">
                    {group.items.map((item, idx) => (
                      <NavLink
                        key={idx}
                        href={item.href || "#"}
                        name={item.name}
                        icon={item.icon ? <item.icon size={20} /> : undefined}
                        className={
                          item.icon ? "justify-start w-full px-3" : "text-sm"
                        }
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        )}
        <NavLink
          href="/dashboard/accounts"
          name={isCollapsed ? "" : "Profile"}
          icon={<User size={20} />}
          className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
        />
      </div>
    </div>
  );
}
