import ContentCard from "@/components/contentCard/ContentCard";
import FetchShippingCharges from "./FetchShippingCharges";
import ShippingChargesTable from "./ShippingChargesTable";

const AllShippingCharges = () => {
  return (
    <>
      <FetchShippingCharges />
      <div className="overflow-hidden md:col-span-3">
        <ContentCard className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              All Shipping Charges
            </h2>
            <p className="text-xs text-muted-foreground">
              View and update existing charges
            </p>
          </div>
          <ShippingChargesTable />
        </ContentCard>
      </div>
    </>
  );
};

export default AllShippingCharges;
