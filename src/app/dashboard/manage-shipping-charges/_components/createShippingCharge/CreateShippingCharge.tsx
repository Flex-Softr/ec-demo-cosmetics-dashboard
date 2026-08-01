import ContentCard from "@/components/contentCard/ContentCard";
import CreateShippingForm from "./CreateShippingForm";

const CreateShippingCharge = () => {
  return (
    <div className="md:col-span-2">
      <ContentCard className="space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground">
            Create Shipping Charge
          </h2>
          <p className="text-xs text-muted-foreground">
            Add a new delivery charge option
          </p>
        </div>
        <CreateShippingForm />
      </ContentCard>
    </div>
  );
};

export default CreateShippingCharge;
