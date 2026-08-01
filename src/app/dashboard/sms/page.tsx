import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import fetchData from "@/utilities/fetchData";
import { MessageSquareText } from "lucide-react";
import OrderStatusMessage from "./components/OrderStatusMessage";
import { OrderStatusToggle } from "./components/OrderStatusToggle";

export default async function SMS() {
  const response = await fetchData({
    endPoint: "/order-sms-notification",
    tags: ["order-sms-notification"],
  });

  const data = await response.data;

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="SMS"
        subtitle="Configure order status notification messages"
        icon={MessageSquareText}
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <OrderStatusToggle data={data} />
        <div className="lg:col-span-2">
          <ContentCard className="p-0 overflow-hidden">
            <OrderStatusMessage savedMessages={data} />
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
