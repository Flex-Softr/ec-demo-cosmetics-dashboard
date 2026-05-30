import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { SidebarClient } from "./SidebarClient";

export async function Sidebar() {
  const { permissions = [] } = await getPermission();

  const isSuperAdmin = isPermitted(permissions);
  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);
  const manageBlog = isPermitted(permissions, PERMISSIONS.MANAGE_BLOG);
  const manageOrder = isPermitted(permissions, PERMISSIONS.MANAGE_ORDER);
  const manageImgToOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_IMAGE_TO_ORDER
  );
  const manageProcessingOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_PROCESSING_ORDER
  );
  const manageShipmentOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_SHIPMENT_ORDER
  );
  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_ADMIN_OR_STAFF
  );
  const manageWarrantyClaim = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_WARRANTY_CLAIM
  );
  const manageCoupon = isPermitted(permissions, PERMISSIONS.MANAGE_COUPON);
  const manageShippingCharge = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_SHIPPING_CHARGE
  );
  const manageCustomer = isPermitted(permissions, PERMISSIONS.MANAGE_CUSTOMER);
  const managePaymentMethod = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_PAYMENT_METHOD
  );

  const manageCourier = isPermitted(permissions, PERMISSIONS.MANAGE_COURIER);

  const sendSMS = isPermitted(permissions, PERMISSIONS.MANAGE_SMS);

  const permissionsObj = {
    isSuperAdmin,
    manageProduct,
    manageBlog,
    manageOrder,
    manageImgToOrder,
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
  };

  return <SidebarClient permissions={permissionsObj} />;
}
