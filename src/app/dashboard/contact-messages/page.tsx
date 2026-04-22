import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import ContactMessagesTable from "./components/ContactMessagesTable";

const ContactMessages = async () => {
  const { permissions = [] } = await getPermission();

  // For now, allow super admin or anyone with customer management permission
  // or the specific manage contact message permission if added
  const canAccess =
    isPermitted(permissions, PERMISSIONS.SUPER_ADMIN) ||
    isPermitted(permissions, PERMISSIONS.MANAGE_CUSTOMER) ||
    isPermitted(permissions, PERMISSIONS.MANAGE_CONTACT_MESSAGE);

  if (!canAccess) {
    redirect("/error");
  }

  return (
    <Card className="m-4">
      <ContactMessagesTable />
    </Card>
  );
};

export default ContactMessages;
