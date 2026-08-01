import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { getPermission } from "@/lib/getAccessToken";
import { ArrowLeft, UserRound } from "lucide-react";
import Link from "next/link";
import CustomerDetailsView from "../_components/CustomerDetailsView";

const page = async ({ params }: { params: { id: string } }) => {
  const { permissions = [] } = await getPermission();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Customer Details"
        subtitle="View profile, shipping address, and order history"
        icon={UserRound}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Link href="/dashboard/registered-customers">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
        }
      />
      <ContentCard className="p-0 overflow-hidden">
        <CustomerDetailsView id={params.id} permissions={permissions} />
      </ContentCard>
    </div>
  );
};

export default page;
