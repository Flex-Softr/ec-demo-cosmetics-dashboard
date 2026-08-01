import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { ImageIcon } from "lucide-react";
import { redirect } from "next/navigation";
import FetchAllImageToOrderReq from "./_components/FetchAllImageToOrderReq";
import ImgToOrderTable from "./_components/ImgToOrderTable/ImgToOrder";

const AllImageToOrderPage = async () => {
  const { permissions = [] } = await getPermission();

  const manageOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_IMAGE_TO_ORDER
  );

  if (!manageOrder) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <FetchAllImageToOrderReq />
      <PageHeader
        title="Order Requests"
        subtitle="Convert image requests into orders"
        icon={ImageIcon}
      />
      <ContentCard>
        <ImgToOrderTable />
      </ContentCard>
    </div>
  );
};

export default AllImageToOrderPage;
