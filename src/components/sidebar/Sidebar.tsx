import config from "@/config/config";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import {
  BarChart,
  Bike,
  ClipboardList,
  Component,
  Glasses,
  Home,
  Image,
  ImagePlusIcon,
  Loader,
  MessageSquareText,
  // MessageSquareText,
  Package,
  Settings,
  ShieldCheck,
  Ticket,
  Truck,
  User,
  UserCheck,
  UsersRound,
} from "lucide-react";
import NavLink from "../NavLink/NavLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function Sidebar() {
  const { permissions = [] } = getPermission();

  const isSuperAdmin = isPermitted(permissions);
  const manageProduct = isPermitted(permissions, permission.manageProduct);
  const manageOrder = isPermitted(permissions, permission.manageOrder);
  const manageImgToOrder = isPermitted(
    permissions,
    permission.manageImageToOrder
  );
  const manageProcessing = isPermitted(
    permissions,
    permission.manageProcessing
  );
  const manageCourier = isPermitted(permissions, permission.manageCourier);
  const manageAdminOrStaff = isPermitted(
    permissions,
    permission.manageAdminOrStaff
  );
  const manageWarrantyClaim = isPermitted(
    permissions,
    permission.manageWarrantyClaim
  );
  const manageCoupons = isPermitted(permissions, permission.manageCoupon);
  const manageShippingCharges = isPermitted(
    permissions,
    permission.manageShippingCharges
  );
  const manageCustomer = isPermitted(permissions, permission.manageCustomers);
  const sendSMS = isPermitted(permissions, permission.manageSms);

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
    // {
    //   href: "/contact",
    //   name: "Contact & Social",
    //   icon: <Shapes size={20} />,
    // },
    // {
    //   href: "/contents",
    //   name: "Text Contents",
    //   icon: <LayoutList size={20} />,
    // },
  ];

  return (
    <div className="bg-white text-gray-900 p-2 shadow-lg min-w-64 h-[calc(100vh-60px)] border-r overflow-y-auto space-y-6">
      <NavLink href="/dashboard" name="Home" icon={<Home size={20} />} />
      {isSuperAdmin && (
        <NavLink
          href="/dashboard/reports"
          name="Reports"
          icon={<BarChart size={20} />}
        />
      )}
      {manageProduct && (
        <Accordion type="single" collapsible className="!mt-0">
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              <div className="flex items-center gap-2">
                <Package size={20} /> <span>Products</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ml-8">
              {productManagementLinks.map((item) => (
                <NavLink
                  key={item.href}
                  href={`/dashboard${item.href}`}
                  name={item.name}
                  // icon={item.icon}
                  className="text-sm"
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {Boolean(config.next_public_show_ito) == true && manageImgToOrder && (
        <NavLink
          href="/dashboard/image-to-order"
          name="Image to order"
          // eslint-disable-next-line jsx-a11y/alt-text
          icon={<Image size={20} />}
        />
      )}
      {manageOrder && (
        <NavLink
          href="/dashboard/orders"
          name="Orders"
          icon={<ClipboardList size={20} />}
        />
      )}

      {manageProcessing && (
        <NavLink
          href="/dashboard/processing-orders"
          name="Processing Orders"
          icon={<Loader size={20} />}
        />
      )}
      {manageCourier && (
        <NavLink
          href="/dashboard/courier-management"
          name="Courier Management"
          icon={<Truck size={20} />}
        />
      )}
      {(manageCourier || manageProcessing) && (
        <NavLink
          href="/dashboard/monitor-delivery"
          name="Monitor Delivery"
          icon={<Glasses size={20} />}
        />
      )}
      <NavLink
        href="/dashboard/fraud-check"
        name="Fraud Check"
        icon={<ShieldCheck size={20} />}
      />
      {manageWarrantyClaim && (
        <NavLink
          href="/dashboard/warranty-claims"
          name="Warranty Claims"
          icon={<Ticket size={20} />}
        />
      )}

      {manageCoupons && (
        <NavLink
          href="/dashboard/manage-coupon"
          name="Manage Coupons"
          icon={<Component size={20} />}
          className="border-t"
        />
      )}
      {manageShippingCharges && (
        <NavLink
          href="/dashboard/manage-shipping-charges"
          name="Shipping Charges"
          icon={<Bike size={20} />}
          className="border-b"
        />
      )}
      {(isSuperAdmin || manageProduct) && (
        <Accordion type="single" collapsible className="!mt-0">
          <AccordionItem value="item-1">
            <AccordionTrigger className=" px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent">
              <div className="flex items-center gap-2">
                <Settings size={20} /> <span>Theme option</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ml-8">
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
      )}
      {manageCustomer && (
        <>
          <NavLink
            href="/dashboard/customers"
            name="Customer List"
            icon={<UsersRound size={20} />}
          />
          <NavLink
            href="/dashboard/registered-customers"
            name="Registered customers"
            icon={<UserCheck size={20} />}
          />
        </>
      )}
      {sendSMS && (
        <NavLink
          href="/dashboard/sms"
          name="SMS"
          icon={<MessageSquareText size={20} />}
        />
      )}

      {manageAdminOrStaff && (
        <NavLink
          href="/dashboard/manage-admin-staff"
          name="Manage Employees"
          icon={<UsersRound size={20} />}
          className="border-t"
        />
      )}

      <NavLink
        href="/dashboard/accounts"
        name="Accounts"
        icon={<User size={20} />}
      />
    </div>
  );
}
