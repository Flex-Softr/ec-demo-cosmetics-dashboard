import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLazyGetAllCustomersQuery } from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/redux/features/customer/customerInterface";
import { Dispatch, SetStateAction, useState } from "react";
import { TFixedCustomersInfo } from "./ViewAndUpdateCouponForm";

const CouponForFixedCustomers = ({
  fixedCustomers,
  setFixedCustomers,
  edit,
}: {
  fixedCustomers: TFixedCustomersInfo[];
  setFixedCustomers: Dispatch<SetStateAction<TFixedCustomersInfo[]>>;
  edit: boolean;
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [triggerGetCustomers, { data: customersRes, isLoading }] =
    useLazyGetAllCustomersQuery();

  const customers = (customersRes?.data as TCustomer[]) || null;

  const addOrRemoveCustomerFromList = (customer: TFixedCustomersInfo) => {
    const isAlreadyExist = fixedCustomers?.find(
      (item) => item._id === customer._id
    );

    if (isAlreadyExist) {
      setFixedCustomers((prev) => [
        ...prev.filter((item) => item._id !== customer._id),
      ]);
    } else {
      setFixedCustomers((prev) => [...prev, customer]);
    }
  };

  return (
    <>
      <hr />
      <Label>Fixed customers</Label>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Customer's 11-digit phone number"
              className="flex-1"
              onChange={(v) => setPhoneNumber(v.target.value)}
              disabled={!edit}
            />
            <button
              type="button"
              className="bg-primary px-5 py-2 rounded-md text-white font-semibold disabled:bg-gray-300"
              disabled={
                phoneNumber?.length !== 11 || isLoading || edit === false
              }
              onClick={() => triggerGetCustomers({ phoneNumber })}
            >
              {isLoading ? "Please wait" : "Search"}
            </button>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold text-center text-destructive">
              {Array.isArray(customers) ? (
                !customers?.length ? (
                  <>No associate customer was found with the number.</>
                ) : null
              ) : null}
            </p>
            {customers?.map((customer) => (
              <div key={customer._id}>
                <div className="flex justify-betweens gap-2">
                  <span>
                    {customer?.name} - <span>{customer.uid}</span>
                  </span>
                  <button
                    className="text-xl bg-primary w-6 h-6 flex justify-center items-center text-white rounded-md disabled:bg-gray-200"
                    type="button"
                    onClick={() => addOrRemoveCustomerFromList(customer)}
                    disabled={!edit}
                  >
                    {fixedCustomers?.find(
                      (item) => item._id === customer._id
                    ) ? (
                      <>-</>
                    ) : (
                      <>+</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          {fixedCustomers?.length ? (
            <>
              <table className="border-collapse w-full rounded-md">
                <caption className="py-2">Fixed customers</caption>
                <tbody>
                  {fixedCustomers.map((fixedCustomer) => (
                    <tr key={fixedCustomer._id}>
                      <td className="border-2 px-5 py-3 flex justify-between -mt-[2px]">
                        <span>
                          {fixedCustomer.name} - {fixedCustomer.phoneNumber}
                        </span>
                        <button
                          className="text-xl bg-primary w-6 h-6 flex justify-center items-center text-white rounded-md disabled:bg-gray-200"
                          type="button"
                          onClick={() =>
                            addOrRemoveCustomerFromList(fixedCustomer)
                          }
                          disabled={!edit}
                        >
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="w-full text-center mt-2">
              No customer has been added yet!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CouponForFixedCustomers;
