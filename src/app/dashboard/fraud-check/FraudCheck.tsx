/* eslint-disable @next/next/no-img-element */
"use client";
import CommonModal from "@/components/modal/CommonModal";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatTime } from "@/lib/formatDate";
import { useLazyGetFraudCheckQuery } from "@/redux/features/fraudCheck/fraudCheckApi";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

type Report = {
  reportFrom: string;
  comment: string;
  date: string;
};

type Errors = {
  errorFrom?: string;
  message: string;
};

type Courier = {
  name: string;
  logo: string;
  orders: number;
  deliveries: number;
  cancellations: number;
  deliveryRate: number;
};

type Data = {
  phoneNumber: string;
  totalOrders: number;
  totalDeliveries: number;
  totalCancellations: number;
  successRatio: number;
  message: string;
  couriers: Courier[];
  reports: Report[];
  errors: Errors[];
};

const FraudCheck = ({ phoneNumber }: { phoneNumber?: string }) => {
  const { toast } = useToast();
  const [data, setData] = useState<Data | null>(null);
  const [mobile, setMobile] = useState("");
  const [triggerFraudCheck, { isFetching: loading }] =
    useLazyGetFraudCheckQuery();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSearch = async () => {
    const phone = (phoneNumber || mobile).trim();
    const regex = /^01\d{9}$/;

    if (!regex.test(phone)) {
      toast({
        variant: "destructive",
        title: "Please enter an 11 digit valid mobile number.",
      });
      return;
    }

    try {
      const response = await triggerFraudCheck(phone).unwrap();
      setData(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title:
          error.data?.message ||
          error.message ||
          `Failed to fetch the customer fraud check data`,
      });
    }
  };

  // const handleKeyPress = (e: { key: string; repeat: unknown }) => {
  //   if (e.key === "Enter" && !e.repeat) {
  //     handleSearch();
  //   }
  // };

  const handleClearSearch = () => {
    setMobile("");
    setData(null);
  };

  useEffect(() => {
    if (phoneNumber) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber]);

  return (
    <>
      <div
        className={`max-w-full ${!phoneNumber && "p-2 mx-2 my-2 sm:p-4 sm:mx-4 sm:my-4"}`}
      >
        {/* Header Search Section */}
        {phoneNumber ? (
          <h1 className="text-xl font-bold text-center">Fraud Check</h1>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 max-w-xl mx-auto">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                // onKeyDown={handleKeyPress}
                placeholder="Enter a mobile number"
                className="bg-gray-100 focus:outline-primary text-gray-800 px-4 pr-12 py-3 rounded border border-gray-300 w-full"
              />
              {mobile ? (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 text-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              ) : (
                <Search className="w-6 h-6 absolute right-3 text-primary" />
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary text-white px-6 py-3 rounded hover:bg-secondary shrink-0"
            >
              {loading ? "Loading..." : "Check"}
            </button>
          </div>
        )}

        {data ? (
          <div className="flex flex-col-reverse justify-center lg:flex-row gap-4 sm:gap-8 items-center lg:items-start w-full">
            {/* Delivery Success Ratio */}
            <div className="text-center w-full lg:w-1/3 mb-4 lg:mb-0 shrink-0">
              <h2 className="text-lg font-bold">Delivery Success Ratio</h2>
              {/* <div className="relative w-32 h-32 mx-auto mt-4">
              <div className="rounded-full border-8 border-green-500 w-full h-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-500">
                  {data.successRatio} %
                </span>
              </div>
            </div> */}
              <div className="relative w-36 h-36 mx-auto mt-4">
                {/* Circular Progress */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                #22c55e ${data.successRatio * 3.6}deg,
                red ${data.successRatio * 3.6}deg
                )`,
                  }}
                ></div>
                {/* Inner Circle */}
                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                  <span
                    className={`text-xl font-bold ${data.successRatio >= 60 ? "text-green-500" : data.successRatio >= 40 ? "text-yellow-500" : "text-red-500"}`}
                  >
                    {data.successRatio}%
                  </span>
                </div>
              </div>
              <p
                className={`mt-2 font-medium ${data.successRatio >= 60 ? "text-green-500" : data.successRatio >= 40 ? "text-yellow-500" : "text-red-500"}`}
              >
                {data.message}
              </p>
            </div>
            <div className="w-full lg:w-2/3 overflow-hidden">
              {/* User Info */}
              <div>
                {data?.reports && data.reports.length > 0 && (
                  <button
                    onClick={handleOpen}
                    className="text-red-600 font-semibold"
                  >
                    View reports ({data?.reports?.length})
                  </button>
                )}

                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Your Number</p>
                  <h3 className="text-xl font-bold text-orange-600">
                    {data.phoneNumber}
                  </h3>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-4 whitespace-nowrap">
                <div>
                  <h4 className="text-xl font-bold">{data.totalOrders}</h4>
                  <p className="text-xs sm:text-sm">মোট অর্ডার</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-green-500">
                    {data.totalDeliveries}
                  </h4>
                  <p className="text-xs sm:text-sm">মোট ডেলিভারি</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-red-500">
                    {data.totalCancellations}
                  </h4>
                  <p className="text-xs sm:text-sm">মোট বাতিল</p>
                </div>
              </div>

              {/* Courier Stats Table */}
              <div className="overflow-x-auto w-full rounded-md">
                <table className="w-full border border-gray-200 text-center text-sm min-w-[500px] whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-4">
                        কুরিয়ার
                      </th>
                      <th className="border border-gray-200 px-4 py-4">
                        অর্ডার
                      </th>
                      <th className="border border-gray-200 px-4 py-4">
                        ডেলিভারি
                      </th>
                      <th className="border border-gray-200 px-4 py-4">
                        বাতিল
                      </th>
                      <th className="border border-gray-200 px-4 py-4">
                        ডেলিভারি হার
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.couriers?.map((courier, index) => (
                      <tr key={index}>
                        <td className="border border-gray-200 px-4 py-4 flex items-center justify-center">
                          <img
                            src={courier.logo}
                            alt={courier.name}
                            className="h-5 mr-2"
                          />
                        </td>
                        <td className="border border-gray-200 px-4 py-4">
                          {courier.orders}
                        </td>
                        <td className="border border-gray-200 px-4 py-4">
                          {courier.deliveries}
                        </td>
                        <td className="border border-gray-200 px-4 py-4">
                          {courier.cancellations}
                        </td>
                        <td className="border border-gray-200 px-4 py-4 font-semibold min-w-[150px]">
                          {courier.deliveryRate}%
                          <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700 mt-[2px]">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: `${courier.deliveryRate}%` }}
                              title={`Delivery success rate ${courier.deliveryRate}%`}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          !phoneNumber && (
            <div className="text-center text-gray-500">
              No data to display. Please enter a mobile number and click
              &quot;Check&quot;.
            </div>
          )
        )}
      </div>
      {data?.errors?.map((error, index) => (
        <div
          key={index}
          className="px-4 py-2 mx-4 border border-gray-300 rounded mb-4 space-y-2 text-red-500"
        >
          <p>
            {error.errorFrom} error: {error.message}
          </p>
        </div>
      ))}

      {data?.reports?.length ? (
        <CommonModal
          open={open}
          handleOpen={handleOpen}
          modalTitle="View reports"
          className="w-[63%]"
        >
          {data?.reports?.map((report, index) => (
            <div
              key={index}
              className="px-4 py-2 border border-gray-300 rounded mb-4"
            >
              <p className="text-gray-600 flex justify-between mb-2">
                <span>{report.reportFrom && `${report.reportFrom}`}</span>
                {`${formatDate(report.date)}, ${formatTime(report.date)}`}
              </p>
              <p>{report.comment}</p>
            </div>
          ))}
        </CommonModal>
      ) : null}
    </>
  );
};

export default FraudCheck;
