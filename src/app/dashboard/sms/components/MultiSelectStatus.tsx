"use client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { useGetMobilesForSMSQuery } from "@/redux/features/sms/smsApi";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import FilterBySource from "../../customers/components/FilterBySource";
import OrderDateRange from "../../orders/components/OrderDateRange";
import SmsContentEditor from "./SmsContentEditor";
// import FilterByTimes from "../../customers/components/FilterByTimes";
import CustomerFilterClear from "../../customers/components/CustomerFilterClear";
import FilterByDivisionDistrict from "../../customers/components/FilterByDivisionDistrict";

type Option = {
  value: string;
  label: string;
};

const statusOptions: Option[] = [
  { value: "completed", label: "Delivered Order" },
  { value: "partial completed", label: "Partial Delivered Order" },
  { value: "canceled", label: "Canceled Order" },
  { value: "follow up", label: "Follow Up Order" },
  { value: "returned", label: "Returned Order" },
];

export default function MultiSelectStatus() {
  const { toast } = useToast();
  const [selectedStatuses, setSelectedStatuses] = useState<Option[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Option[]>([]);
  const [mobileNumbers, setMobileNumbers] = useState<string[]>([]);

  const { startFrom, endAt } = useAppSelector(({ orders }) => orders);

  const {
    // selectedTimes,
    selectedSource,
    selectedUpazila,
    selectedDistrict,
    selectedDivision,
  } = useAppSelector(({ customerOrders }) => customerOrders);

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({
    status: "all",
    sort: "-createdAt",
    page: 1,
    limit: 1000,
  });

  const productOptions: Option[] = useMemo(() => {
    return (
      productsData?.data?.data?.map((item: { title: string; _id: string }) => ({
        label: item.title,
        value: item._id,
      })) || []
    );
  }, [productsData]);

  // const shouldSkip = !(
  //   selectedStatuses.length > 0 ||
  //   selectedProducts.length > 0 ||
  //   selectedSource ||
  //   selectedDivision ||
  //   selectedDistrict ||
  //   selectedUpazila ||
  //   startFrom ||
  //   endAt
  // );

  const {
    data: mobilesData,
    isLoading: mobilesLoading,
    error: mobilesError,
  } = useGetMobilesForSMSQuery(
    {
      status: selectedStatuses.map((option) => option.value).join(","),
      productIds: selectedProducts.map((option) => option.value).join(","),
      orderSource: selectedSource,
      division: selectedDivision,
      district: selectedDistrict,
      upazila: selectedUpazila,
      startFrom,
      endAt,
      sort: "-createdAt",
    }
    // {
    //   skip: shouldSkip,
    // }
  );

  useEffect(() => {
    if (mobilesError) {
      toast({
        title: "Error",
        description:
          "Failed to fetch mobile numbers. Please check your filters.",
        variant: "destructive",
      });
    }
    if (productsError) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    }

    if (mobilesData?.data?.phoneNumbers) {
      setMobileNumbers(mobilesData.data.phoneNumbers);
    } else {
      setMobileNumbers([]);
    }
  }, [mobilesData, mobilesError, productsError, toast]);

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value
      .split(",")
      .map((num) => num.trim().replace(/\s+/g, ""));

    setMobileNumbers(numbers);
  };

  const totalNumbers = [...mobileNumbers];
  // Remove last empty entry (if any)
  if (mobileNumbers[mobileNumbers.length - 1]?.trim() === "") {
    totalNumbers.pop();
  }

  return (
    <div>
      <div className="flex flex-wrap-reverse justify-end items-center gap-5 mb-4">
        {/* <FilterByTimes /> */}
        <FilterByDivisionDistrict />
        <OrderDateRange />
        <FilterBySource />
        <CustomerFilterClear />
      </div>

      <label className="flex items-end justify-between font-semibold mb-2 text-slate-800">
        <span>Customers</span>
      </label>

      <Select
        options={statusOptions}
        value={selectedStatuses}
        onChange={(newValue) => setSelectedStatuses(newValue as Option[])}
        isMulti
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select order statuses..."
        closeMenuOnSelect={false}
      />

      <label className="block font-semibold mt-5 mb-2 text-slate-800">
        Products
      </label>

      <Select
        options={productOptions}
        value={selectedProducts}
        onChange={(newValue) => setSelectedProducts(newValue as Option[])}
        isMulti
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select products..."
        isLoading={productsLoading}
        closeMenuOnSelect={false}
      />

      <label className="block font-semibold mt-5 text-slate-800">
        Mobile Numbers
      </label>

      <Input
        placeholder="Example: 01700000011, 01700000022"
        value={mobileNumbers}
        onChange={handleMobileInputChange}
      />

      {totalNumbers.length > 0 && !mobilesLoading && (
        <p className="text-sm text-slate-500 mt-2 mb-4">
          Total Numbers: {totalNumbers.length}
        </p>
      )}

      <SmsContentEditor mobileNumbers={totalNumbers} />
    </div>
  );
}
