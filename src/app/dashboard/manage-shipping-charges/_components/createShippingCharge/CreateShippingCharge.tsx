import { Card } from "@/components/ui/card";
import CreateShippingForm from "./CreateShippingForm";

const CreateShippingCharge = () => {
  return (
    <div className="col-span-2">
      <Card className="p-4 shadow-none rounded-xl space-y-5">
        <h2 className="text-xl font-bold">Create shipping charge</h2>
        <hr className="!mt-2" />
        <CreateShippingForm />
      </Card>
    </div>
  );
};

export default CreateShippingCharge;
