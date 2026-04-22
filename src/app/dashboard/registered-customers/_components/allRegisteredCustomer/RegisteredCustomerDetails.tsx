import { TRegisteredCustomer } from "@/types/registeredUser";
import { Eye } from "lucide-react";
import Link from "next/link";

const RegisteredCustomerDetails = ({
  customer,
}: {
  customer: TRegisteredCustomer;
}) => {
  return (
    <div className="flex justify-center">
      <Link
        href={`/dashboard/registered-customers/${customer._id}`}
        className="w-9 h-9 flex justify-center items-center rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm"
        title="View Details"
      >
        <Eye size={18} />
      </Link>
    </div>
  );
};

export default RegisteredCustomerDetails;
