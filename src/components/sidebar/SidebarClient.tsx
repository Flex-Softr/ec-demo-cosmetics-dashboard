"use client";

import config from "@/config/config";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProvider";
import {
  BarChart,
  CircleDollarSign,
  ClipboardList,
  Home,
  Image as ImageIcon,
  ImagePlusIcon,
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
    manageProcessing: boolean;
    manageCourier: boolean;
    manageAdminOrStaff: boolean;
    manageWarrantyClaim: boolean;
    manageCoupons: boolean;
    manageShippingCharges: boolean;
    manageCustomer: boolean;
    sendSMS: boolean;
  };
};

export function SidebarClient({ permissions }: TProps) {
  const { isCollapsed } = useSidebar();

  const {
    isSuperAdmin,
    manageProduct,
    manageOrder,
    manageImgToOrder,
    manageProcessing,
    manageCourier,
    manageAdminOrStaff,
    manageWarrantyClaim,
    manageCoupons,
    manageShippingCharges,
    manageCustomer,
    sendSMS,
  } = permissions;

  const productManagementLinks = [
    {
      href: "/products",
      name: "All Products",
    },
    {
      href: "/add-products",
      name: "Add Product",
    },
    {
      href: "/category",
      name: "Category",
    },
    {
      href: "/attribute",
      name: "Attribute",
    },
    {
      href: "/brand",
      name: "Brand",
    },
    {
      href: "/media",
      name: "Media",
    },
  ];

  const themeOptionLinks = [
    {
      href: "/slider-section",
      name: "Slider Section",
      icon: <ImagePlusIcon size={20} />,
    },
  ];

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

        {/* Product Accordion */}
        {manageProduct &&
          (isCollapsed ? (
            <NavLink
              href="/dashboard/products"
              name=""
              icon={<Package size={20} />}
              className="justify-center w-full px-0 pl-2"
              // On click, maybe expand? For now just a link to main products page or inert
            />
          ) : (
            <Accordion type="single" collapsible className="!mt-0">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Package size={20} /> <span>Products</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-8 pb-0">
                  {productManagementLinks.map((item) => (
                    <NavLink
                      key={item.href}
                      href={`/dashboard${item.href}`}
                      name={item.name}
                      className="text-sm"
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}

        {Boolean(config.next_public_show_ito) === true && manageImgToOrder && (
          <NavLink
            href="/dashboard/image-to-order"
            name={isCollapsed ? "" : "Image to order"}
            icon={<ImageIcon size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}
        {manageOrder && (
          <NavLink
            href="/dashboard/orders"
            name={isCollapsed ? "" : "Orders"}
            icon={<ClipboardList size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}

        {manageProcessing && (
          <NavLink
            href="/dashboard/processing-orders"
            name={isCollapsed ? "" : "Processing Orders"}
            icon={<RefreshCcw size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}
        {manageCourier && (
          <NavLink
            href="/dashboard/courier-management"
            name={isCollapsed ? "" : "Courier Management"}
            icon={<Truck size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}
        {(manageCourier || manageProcessing) && (
          <NavLink
            href="/dashboard/monitor-delivery"
            name={isCollapsed ? "" : "Monitor Delivery"}
            icon={<MapPinned size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}
        {manageCourier && (
          <NavLink
            href="/dashboard/courier-configuration"
            name={isCollapsed ? "" : "Courier Configuration"}
            icon={<Truck size={20} />} // Reusing Truck icon or maybe Settings
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}
        <NavLink
          href="/dashboard/fraud-check"
          name={isCollapsed ? "" : "Fraud Check"}
          icon={<ShieldCheck size={20} />}
          className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
        />
        {manageWarrantyClaim && (
          <NavLink
            href="/dashboard/warranty-claims"
            name={isCollapsed ? "" : "Warranty Claims"}
            icon={<ShieldAlert size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}

        {manageCoupons && (
          <NavLink
            href="/dashboard/manage-coupon"
            name={isCollapsed ? "" : "Manage Coupons"}
            icon={<TicketPercent size={20} />}
            className={cn(
              "border-t pt-2",
              isCollapsed && "justify-center w-full px-0 pl-2 border-none pt-0"
            )}
          />
        )}
        {manageShippingCharges && (
          <NavLink
            href="/dashboard/manage-shipping-charges"
            name={isCollapsed ? "" : "Shipping Charges"}
            icon={<CircleDollarSign size={20} />}
            className={cn(
              "border-b pb-2",
              isCollapsed && "justify-center w-full px-0 pl-2 border-none pb-0"
            )}
          />
        )}

        {/* Theme Accordion */}
        {(isSuperAdmin || manageProduct) &&
          (isCollapsed ? (
            <NavLink
              href="/dashboard/slider-section"
              name=""
              icon={<Settings size={20} />}
              className="justify-center w-full px-0 pl-2"
            />
          ) : (
            <Accordion type="single" collapsible className="!mt-0">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Settings size={20} /> <span>Theme option</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-8 pb-0">
                  {themeOptionLinks.map((item) => (
                    <NavLink
                      key={item.href}
                      href={`/dashboard${item.href}`}
                      name={item.name}
                      icon={item.icon}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}

        {manageCustomer && (
          <>
            <NavLink
              href="/dashboard/customers"
              name={isCollapsed ? "" : "Customer List"}
              icon={<UsersRound size={20} />}
              className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
            />
            <NavLink
              href="/dashboard/registered-customers"
              name={isCollapsed ? "" : "Registered customers"}
              icon={<UserCheck size={20} />}
              className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
            />
          </>
        )}
        {sendSMS && (
          <NavLink
            href="/dashboard/sms"
            name={isCollapsed ? "" : "SMS"}
            icon={<MessageSquareText size={20} />}
            className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
          />
        )}

        {manageAdminOrStaff && (
          <NavLink
            href="/dashboard/manage-admin-staff"
            name={isCollapsed ? "" : "Manage Employees"}
            icon={<UserCog size={20} />}
            className={cn(
              "border-t pt-2",
              isCollapsed && "justify-center w-full px-0 pl-2 border-none pt-0"
            )}
          />
        )}

        <NavLink
          href="/dashboard/accounts"
          name={isCollapsed ? "" : "Accounts"}
          icon={<User size={20} />}
          className={cn(isCollapsed && "justify-center w-full px-0 pl-2")}
        />
      </div>
    </div>
  );
}
