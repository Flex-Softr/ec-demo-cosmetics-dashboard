import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Mail } from "lucide-react";
import { redirect } from "next/navigation";
import ContactMessagesTable from "./components/ContactMessagesTable";

const ContactMessages = async () => {
  const { permissions = [] } = await getPermission();

  const canAccess =
    isPermitted(permissions, PERMISSIONS.SUPER_ADMIN) ||
    isPermitted(permissions, PERMISSIONS.MANAGE_CUSTOMER) ||
    isPermitted(permissions, PERMISSIONS.MANAGE_CONTACT_MESSAGE);

  if (!canAccess) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Contact Messages"
        subtitle="Review and respond to customer inquiries"
        icon={Mail}
      />
      <ContentCard>
        <ContactMessagesTable />
      </ContentCard>
    </div>
  );
};

export default ContactMessages;
