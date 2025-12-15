import { Card } from "@/components/ui/card";
import FetchShippingCharges from "./FetchShippingCharges";
import ShippingChargesTable from "./ShippingChargesTable";

const AllShippingCharges = () => {
  return (
    <>
      <FetchShippingCharges />
      <div className="col-span-3">
        <Card className="space-y-5">
          <h2 className="text-xl font-bold">All shipping charges</h2>
          <hr className="!mt-2" />
          <ShippingChargesTable />
        </Card>
      </div>
    </>
  );
};

export default AllShippingCharges;
