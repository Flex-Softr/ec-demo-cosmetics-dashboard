import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { ShieldAlert } from "lucide-react";
import FraudCheck from "./FraudCheck";

const FraudCheckPage = () => {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Fraud Check"
        subtitle="Verify customer delivery history by mobile number"
        icon={ShieldAlert}
      />
      <ContentCard>
        <FraudCheck />
      </ContentCard>
    </div>
  );
};

export default FraudCheckPage;
