import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { SidebarClient } from "./SidebarClient";

export async function Sidebar() {
  const { permissions = [] } = await getPermission();

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
  const managePaymentMethod = isPermitted(
    permissions,
    permission.managePaymentMethod
  );
  const sendSMS = isPermitted(permissions, permission.manageSms);

  const permissionsObj = {
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
    managePaymentMethod,
    sendSMS,
  };

  return <SidebarClient permissions={permissionsObj} />;
}
