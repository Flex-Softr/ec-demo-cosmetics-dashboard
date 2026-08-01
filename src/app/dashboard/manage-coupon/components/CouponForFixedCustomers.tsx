"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLazyGetAllCustomersQuery } from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/redux/features/customer/customerInterface";
import { Dispatch, SetStateAction, useState } from "react";

export type TFixedCustomersInfo = {
  _id: string;
  name: string;
  uid: string;
  phoneNumber: string;
};

const CouponForFixedCustomers = ({
  fixedCustomers,
  setFixedCustomers,
}: {
  fixedCustomers: TFixedCustomersInfo[];
  setFixedCustomers: Dispatch<SetStateAction<TFixedCustomersInfo[]>>;
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [triggerGetCustomers, { data: customersRes, isLoading }] =
    useLazyGetAllCustomersQuery();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData: any = customersRes?.data;
  const customers =
    (responseData?.data as TCustomer[]) ||
    (customersRes?.data as TCustomer[]) ||
    null;

  const addOrRemoveCustomerFromList = (customer: TFixedCustomersInfo) => {
    const isAlreadyExist = fixedCustomers.find(
      (item) => item._id === customer._id
    );

    if (isAlreadyExist) {
      setFixedCustomers((prev) =>
        prev.filter((item) => item._id !== customer._id)
      );
    } else {
      setFixedCustomers((prev) => [...prev, customer]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Fixed Customers</h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <Label className="text-muted-foreground">Search by phone</Label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Customer's 11-digit phone number"
              className="flex-1 rounded-lg"
              value={phoneNumber}
              onChange={(v) => setPhoneNumber(v.target.value)}
            />
            <Button
              type="button"
              size="sm"
              className="rounded-lg shrink-0"
              disabled={phoneNumber.length !== 11 || isLoading}
              onClick={() => triggerGetCustomers({ phoneNumber })}
            >
              {isLoading ? "Searching…" : "Search"}
            </Button>
          </div>
          <div className="space-y-2">
            {Array.isArray(customers) && !customers.length ? (
              <p className="text-center text-xs font-medium text-destructive">
                No associate customer was found with the number.
              </p>
            ) : null}
            {customers?.map((customer) => (
              <div
                key={customer._id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm text-foreground">
                  {customer?.name} — {customer.uid}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 rounded-md"
                  onClick={() => addOrRemoveCustomerFromList(customer)}
                >
                  {fixedCustomers.find((item) => item._id === customer._id)
                    ? "−"
                    : "+"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-3">
          {fixedCustomers.length ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Selected customers
              </p>
              {fixedCustomers.map((fixedCustomer) => (
                <div
                  key={fixedCustomer._id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                >
                  <span className="text-sm text-foreground">
                    {fixedCustomer.name} — {fixedCustomer.phoneNumber}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => addOrRemoveCustomerFromList(fixedCustomer)}
                  >
                    −
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No customer has been added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponForFixedCustomers;
