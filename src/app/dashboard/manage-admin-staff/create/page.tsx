import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import StaffForm from "../components/StaffForm";

const CreateAdminPage = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_ADMIN_OR_STAFF
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Create Admin"
        subtitle="Add a new admin account with selected permissions"
        icon={UserPlus}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Link href="/dashboard/manage-admin-staff">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <StaffForm />
      </ContentCard>
    </div>
  );
};

export default CreateAdminPage;
