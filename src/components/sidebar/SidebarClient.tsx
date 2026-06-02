"use client";

import Image from "next/image";
import logo from "../../../public/logo.png";
// import config from "@/config/config";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProvider";
import {
  BarChart,
  CircleDollarSign,
  ClipboardList,
  Home,
  LayoutGrid,
  LibraryBig,
  Image as ImageIcon,
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
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import NavLink from "../NavLink/NavLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useGetUnreadContactMessagesCountQuery } from "@/redux/features/contactMessage/contactMessageApi";

type TProps = {
  permissions: {
    isSuperAdmin: boolean;
    manageProduct: boolean;
    manageBlog: boolean;
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
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const {
    isSuperAdmin,
    manageProduct,
    manageBlog,
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
        // manageWarrantyClaim && {
        //   name: "Warranty Claims",
        //   href: "/dashboard/warranty-claims",
        //   // icon: ShieldAlert,
        // },
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
      key: "media",
      label: "Media",
      icon: ImageIcon,
      visible: !!manageProduct,
      items: [
        { name: "Media", href: "/dashboard/media" },
        { name: "Book Previews", href: "/dashboard/book-previews" },
        { name: "Free PDFs", href: "/dashboard/free-pdfs" },
      ],
    },
    {
      key: "blog-qna",
      label: "Blog & QnA",
      icon: LibraryBig,
      visible: !!(isSuperAdmin || manageBlog),
      items: [
        { name: "Blog Posts", href: "/dashboard/blog-posts" },
        { name: "QnA", href: "/dashboard/qna" },
        { name: "Categories", href: "/dashboard/blog-qna-categories" },
        { name: "Topics", href: "/dashboard/blog-qna-topics" },
        { name: "Tags", href: "/dashboard/blog-qna-tags" },
      ],
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
        (isSuperAdmin || manageProduct) && {
          name: "Homepage Sections",
          href: "/dashboard/homepage-section",
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
        {
          name: "Contact Messages",
          href: "/dashboard/contact-messages",
        },
      ],
    },
  ];

  const activeGroup = sidebarGroups.find((group) =>
    group.items.some((item) => item.href === pathname)
  )?.key;

  const getCollapsedItems = () => {
    const items: SidebarItem[] = [];

    if (manageProduct) {
      items.push({
        name: "",
        href: "/dashboard/products",
        icon: Package,
      });
      items.push({
        name: "",
        href: "/dashboard/media",
        icon: ImageIcon,
      });
      items.push({
        name: "",
        href: "/dashboard/book-previews",
        icon: LayoutGrid,
      });
    }

    if (isSuperAdmin || manageBlog) {
      items.push({
        name: "",
        href: "/dashboard/blog-posts",
        icon: LibraryBig,
      });
      items.push({
        name: "",
        href: "/dashboard/qna",
        icon: MessageSquareText,
      });
      items.push({
        name: "",
        href: "/dashboard/blog-qna-topics",
        icon: LibraryBig,
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
    if (isSuperAdmin || manageProduct) {
      items.push({
        name: "",
        href: "/dashboard/slider-section",
        icon: Settings,
      });
      items.push({
        name: "",
        href: "/dashboard/homepage-section",
        icon: LayoutGrid,
      });
    }

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
      items.push({
        name: "",
        href: "/dashboard/contact-messages",
        icon: MessageSquareText,
      });
    }

    return items;
  };

  const { data: unreadCountData } = useGetUnreadContactMessagesCountQuery(
    undefined,
    {
      pollingInterval: 600000, // Optional: Poll every 600 seconds
    }
  );
  const unreadCount = unreadCountData?.data || 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={cn(
          "bg-white text-gray-900 shadow-lg h-screen md:h-[calc(100vh-60px)] top-0 md:top-auto border-r overflow-y-auto no-scrollbar transition-all duration-300 fixed md:relative z-50 flex flex-col",
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-[60px]"
            : "translate-x-0 w-64 box-border px-4"
        )}
      >
        <div
          className={cn(
            "space-y-4",
            isCollapsed ? "items-center flex flex-col space-y-2 p-1 w-full" : ""
          )}
        >
          {/* Mobile-only: header with logo + close button (covers full screen incl. navbar) */}
          {!isCollapsed && (
            <div className="flex items-center justify-between pl-3 py-2 mb-1 border-b bg-white md:hidden">
              <Image
                src={logo}
                alt="Logo"
                width={80}
                height={40}
                className="object-contain h-10 w-auto"
                priority
              />
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <NavLink
            href="/dashboard"
            name={isCollapsed ? "" : "Home"}
            icon={<Home size={20} />}
            className={cn(
              "m-0 mt-5",
              isCollapsed &&
                "justify-center gap-0 mx-auto p-2 border border-gray-300"
            )}
          />
          {isSuperAdmin && (
            <NavLink
              href="/dashboard/reports"
              name={isCollapsed ? "" : "Reports"}
              icon={<BarChart size={20} />}
              className={cn(
                "m-0",
                isCollapsed &&
                  "justify-center gap-0 mx-auto p-2 border border-gray-300"
              )}
            />
          )}

          {isCollapsed ? (
            <div className="flex flex-col gap-2 w-full items-center">
              {getCollapsedItems().map((item, idx) => (
                <NavLink
                  key={idx}
                  href={item.href || "#"}
                  name=""
                  icon={
                    <div className="relative">
                      {item.icon ? <item.icon size={20} /> : undefined}
                      {item.href === "/dashboard/contact-messages" &&
                        unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                    </div>
                  }
                  className="justify-center gap-0 mx-auto p-2 border border-gray-300"
                />
              ))}
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              className="!mt-0 w-full"
              defaultValue={activeGroup}
            >
              {sidebarGroups
                .filter((group) => group.visible && group.items.length > 0)
                .map((group) => {
                  const isGroupActive = group.key === activeGroup;
                  return (
                    <AccordionItem
                      key={group.key}
                      value={group.key}
                      className="border-none mt-1"
                    >
                      <AccordionTrigger
                        className={cn(
                          "px-2 py-2 text-sm font-semibold transition-all duration-300 group border-b-0 hover:no-underline rounded-lg",
                          isGroupActive
                            ? "text-primary bg-primary/5 shadow-sm font-bold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <group.icon
                              size={20}
                              className={cn(
                                "transition-colors",
                                isGroupActive
                                  ? "text-primary"
                                  : "text-gray-500 group-hover:text-primary"
                              )}
                            />
                            {group.key === "customers" && unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <span className="tracking-wide">{group.label}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="ml-4 mt-1">
                        {group.items.map((item, idx) => (
                          <NavLink
                            key={idx}
                            href={item.href || "#"}
                            name={item.name}
                            icon={
                              item.icon ? <item.icon size={20} /> : undefined
                            }
                            className={
                              item.icon
                                ? "justify-start w-full"
                                : "text-sm m-0 px-0"
                            }
                            badge={
                              item.href === "/dashboard/contact-messages" &&
                              unreadCount > 0 ? (
                                <span className="bg-red-500 text-white text-[10px] min-w-[1.25rem] h-5 flex items-center justify-center rounded-full ml-auto px-1 shadow-sm border border-white/20 mr-2">
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                              ) : undefined
                            }
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          )}
          <NavLink
            href="/dashboard/accounts"
            name={isCollapsed ? "" : "Profile"}
            icon={<User size={20} />}
            className={cn(
              "m-0 mb-5",
              isCollapsed &&
                "justify-center gap-0 mx-auto p-2 border border-gray-300"
            )}
          />
        </div>
      </div>
    </>
  );
}
