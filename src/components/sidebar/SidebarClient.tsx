"use client";

import Image from "next/image";
import logo from "../../../public/logo.png";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProvider";
import {
  BadgePercent,
  BarChart3,
  Boxes,
  CircleUser,
  FileText,
  FolderOpen,
  GalleryHorizontal,
  Headset,
  LayoutDashboard,
  LucideIcon,
  MapPinned,
  MessageSquareText,
  Newspaper,
  PackagePlus,
  PackageSearch,
  PanelTop,
  Receipt,
  RefreshCcw,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Truck,
  UserCheck,
  UserCog,
  Users,
  Warehouse,
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
    { href: "/products", name: "All Products", icon: PackageSearch },
    { href: "/add-products", name: "Add Product", icon: PackagePlus },
    { href: "/category", name: "Category", icon: FolderOpen },
    { href: "/attribute", name: "Attribute", icon: Tags },
    { href: "/brand", name: "Brand", icon: BadgePercent },
    { href: "/collection", name: "Collection", icon: Boxes },
  ];

  const sidebarGroups: SidebarGroup[] = [
    {
      key: "products",
      label: "Products",
      icon: Boxes,
      visible: !!manageProduct,
      items: productManagementLinks.map((link) => ({
        name: link.name,
        href: `/dashboard${link.href}`,
        icon: link.icon,
      })),
    },
    {
      key: "orders",
      label: "Orders",
      icon: ShoppingBag,
      visible: true,
      items: [
        manageOrder && {
          name: "Orders",
          href: "/dashboard/orders",
          icon: Receipt,
        },
        manageProcessingOrder && {
          name: "Processing Orders",
          href: "/dashboard/processing-orders",
          icon: RefreshCcw,
        },
        manageShipmentOrder && {
          name: "Courier Shipments",
          href: "/dashboard/courier-shipment",
          icon: Truck,
        },
        (manageCourier || manageProcessingOrder) && {
          name: "Monitor Delivery",
          href: "/dashboard/monitor-delivery",
          icon: MapPinned,
        },
        (manageOrder ||
          manageProcessingOrder ||
          manageShipmentOrder ||
          isSuperAdmin) && {
          name: "Fraud Check",
          href: "/dashboard/fraud-check",
          icon: ShieldCheck,
        },
      ].filter(Boolean) as SidebarItem[],
    },
    {
      key: "media",
      label: "Media",
      icon: GalleryHorizontal,
      visible: !!manageProduct,
      items: [
        {
          name: "Media",
          href: "/dashboard/media",
          icon: GalleryHorizontal,
        },
        {
          name: "Book Previews",
          href: "/dashboard/book-previews",
          icon: FileText,
        },
        { name: "Free PDFs", href: "/dashboard/free-pdfs", icon: FileText },
      ],
    },
    {
      key: "blog-qna",
      label: "Blog & QnA",
      icon: Newspaper,
      visible: !!(isSuperAdmin || manageBlog),
      items: [
        {
          name: "Blog Posts",
          href: "/dashboard/blog-posts",
          icon: Newspaper,
        },
        { name: "QnA", href: "/dashboard/qna", icon: MessageSquareText },
        {
          name: "Categories",
          href: "/dashboard/blog-qna-categories",
          icon: FolderOpen,
        },
        {
          name: "Topics",
          href: "/dashboard/blog-qna-topics",
          icon: Tags,
        },
        {
          name: "Tags",
          href: "/dashboard/blog-qna-tags",
          icon: Tags,
        },
      ],
    },
    {
      key: "configuration",
      label: "Configuration",
      icon: Settings2,
      visible: true,
      items: [
        (isSuperAdmin || manageProduct) && {
          name: "Slider Config",
          href: "/dashboard/slider-section",
          icon: PanelTop,
        },
        (isSuperAdmin || manageProduct) && {
          name: "Homepage Sections",
          href: "/dashboard/homepage-section",
          icon: LayoutDashboard,
        },
        manageShippingCharge && {
          name: "Shipping Charges",
          href: "/dashboard/manage-shipping-charges",
          icon: Truck,
        },
        managePaymentMethod && {
          name: "Payment Config",
          href: "/dashboard/payment-configuration",
          icon: BadgePercent,
        },
        manageCourier && {
          name: "Courier Config",
          href: "/dashboard/courier-configuration",
          icon: Warehouse,
        },
        manageAdminOrStaff && {
          name: "Manage Employees",
          href: "/dashboard/manage-admin-staff",
          icon: UserCog,
        },
      ].filter(Boolean) as SidebarItem[],
    },
    {
      key: "marketing",
      label: "Marketing",
      icon: BadgePercent,
      visible: !!(manageCoupon || sendSMS),
      items: [
        manageCoupon && {
          name: "Manage Coupons",
          href: "/dashboard/manage-coupon",
          icon: BadgePercent,
        },
        sendSMS && {
          name: "SMS",
          href: "/dashboard/sms",
          icon: MessageSquareText,
        },
      ].filter(Boolean) as SidebarItem[],
    },
    {
      key: "customers",
      label: "Customers",
      icon: Users,
      visible: !!manageCustomer,
      items: [
        {
          name: "Customer List",
          href: "/dashboard/customers",
          icon: Users,
        },
        {
          name: "Registered customers",
          href: "/dashboard/registered-customers",
          icon: UserCheck,
        },
        {
          name: "Contact Messages",
          href: "/dashboard/contact-messages",
          icon: Headset,
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
        icon: Boxes,
      });
      items.push({
        name: "",
        href: "/dashboard/media",
        icon: GalleryHorizontal,
      });
      items.push({
        name: "",
        href: "/dashboard/book-previews",
        icon: FileText,
      });
    }

    if (isSuperAdmin || manageBlog) {
      items.push({
        name: "",
        href: "/dashboard/blog-posts",
        icon: Newspaper,
      });
      items.push({
        name: "",
        href: "/dashboard/qna",
        icon: MessageSquareText,
      });
      items.push({
        name: "",
        href: "/dashboard/blog-qna-topics",
        icon: Tags,
      });
    }

    if (manageOrder)
      items.push({ name: "", href: "/dashboard/orders", icon: Receipt });
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
        icon: Truck,
      });
    if (managePaymentMethod)
      items.push({
        name: "",
        href: "/dashboard/payment-configuration",
        icon: BadgePercent,
      });
    if (manageCourier)
      items.push({
        name: "",
        href: "/dashboard/courier-configuration",
        icon: Warehouse,
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
        icon: PanelTop,
      });
      items.push({
        name: "",
        href: "/dashboard/homepage-section",
        icon: LayoutDashboard,
      });
    }

    if (manageCoupon)
      items.push({
        name: "",
        href: "/dashboard/manage-coupon",
        icon: BadgePercent,
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
        icon: Users,
      });
      items.push({
        name: "",
        href: "/dashboard/registered-customers",
        icon: UserCheck,
      });
      items.push({
        name: "",
        href: "/dashboard/contact-messages",
        icon: Headset,
      });
    }

    return items;
  };

  const { data: unreadCountData } = useGetUnreadContactMessagesCountQuery(
    undefined,
    {
      pollingInterval: 600000,
    }
  );
  const unreadCount = unreadCountData?.data || 0;

  const collapsedLinkClass =
    "justify-center gap-0 mx-auto !px-2 !py-2 border-0 shadow-none";

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={cn(
          "bg-white/95 backdrop-blur-sm text-slate-900 border-r border-slate-200/80 h-screen md:h-[calc(100vh-60px)] top-0 md:top-auto overflow-y-auto no-scrollbar transition-all duration-300 fixed md:relative z-50 flex flex-col",
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-[68px]"
            : "translate-x-0 w-64 box-border"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-0.5 py-3",
            isCollapsed ? "items-center px-2" : "px-2.5"
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center justify-between px-1 py-2 mb-2 border-b border-slate-100 md:hidden">
              <Image
                src={logo}
                alt="Logo"
                width={80}
                height={40}
                className="object-contain h-9 w-auto"
                priority
              />
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className={cn("space-y-0.5", !isCollapsed && "mb-1")}>
            <NavLink
              href="/dashboard"
              name={isCollapsed ? "" : "Home"}
              icon={<LayoutDashboard size={18} strokeWidth={1.75} />}
              className={cn("m-0", isCollapsed && collapsedLinkClass)}
            />
            {isSuperAdmin && (
              <NavLink
                href="/dashboard/reports"
                name={isCollapsed ? "" : "Reports"}
                icon={<BarChart3 size={18} strokeWidth={1.75} />}
                className={cn("m-0", isCollapsed && collapsedLinkClass)}
              />
            )}
          </div>

          {!isCollapsed && (
            <div className="mx-1 my-2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          )}

          {isCollapsed ? (
            <div className="flex flex-col gap-1 w-full items-center py-1">
              {getCollapsedItems().map((item, idx) => (
                <NavLink
                  key={idx}
                  href={item.href || "#"}
                  name=""
                  icon={
                    <div className="relative">
                      {item.icon ? (
                        <item.icon size={18} strokeWidth={1.75} />
                      ) : undefined}
                      {item.href === "/dashboard/contact-messages" &&
                        unreadCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center ring-2 ring-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                    </div>
                  }
                  className={collapsedLinkClass}
                />
              ))}
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-0.5"
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
                      className="border-none"
                    >
                      <AccordionTrigger
                        className={cn(
                          "px-2.5 py-2 text-sm transition-all duration-200 group border-b-0 hover:no-underline rounded-lg [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-slate-500",
                          isGroupActive
                            ? "text-primary bg-primary/5 font-semibold"
                            : "text-slate-800 hover:bg-slate-50 hover:text-primary font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative shrink-0">
                            <group.icon
                              size={18}
                              strokeWidth={1.75}
                              className={cn(
                                "transition-colors",
                                isGroupActive
                                  ? "text-primary"
                                  : "text-slate-700 group-hover:text-primary"
                              )}
                            />
                            {group.key === "customers" && unreadCount > 0 && (
                              <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white" />
                            )}
                          </div>
                          <span className="tracking-wide text-sm">
                            {group.label}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pt-0.5 ml-3 pl-3 border-l border-slate-200">
                        {group.items.map((item, idx) => (
                          <NavLink
                            key={idx}
                            href={item.href || "#"}
                            name={item.name}
                            icon={
                              item.icon ? (
                                <item.icon size={16} strokeWidth={1.75} />
                              ) : undefined
                            }
                            className="justify-start w-full text-sm m-0 !py-1.5 !px-2"
                            badge={
                              item.href === "/dashboard/contact-messages" &&
                              unreadCount > 0 ? (
                                <span className="bg-red-500 text-white text-[10px] min-w-[1.25rem] h-5 flex items-center justify-center rounded-full ml-auto px-1.5 shadow-sm">
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

          {!isCollapsed && (
            <div className="mx-1 my-2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          )}

          <NavLink
            href="/dashboard/accounts"
            name={isCollapsed ? "" : "Profile"}
            icon={<CircleUser size={18} strokeWidth={1.75} />}
            className={cn("m-0 mt-0.5", isCollapsed && collapsedLinkClass)}
          />
        </div>
      </div>
    </>
  );
}
