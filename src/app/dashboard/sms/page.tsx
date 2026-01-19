// import { StatCard } from "./components/StatCard";
// import { BalanceTopUp } from "./components/BalanceTopUp";
import fetchData from "@/utilities/fetchData";
import OrderStatusMessage from "./components/OrderStatusMessage";
import { OrderStatusToggle } from "./components/OrderStatusToggle";

export default async function SMS() {
  const response = await fetchData({
    endPoint: "/order-sms-notification",
    tags: ["order-sms-notification"],
  });

  const data = await response.data;

  return (
    <div className="space-y-6 mb-16">
      {/* Top Stats Section */}
      {/* <div className="grid grid-cols-4 gap-6">
        <StatCard label="Total SMS Sent" value={1834} color="purple" />
        <StatCard label="Total SMS Cost (BDT)" value={825.3} color="purple" />
        <BalanceTopUp />
        <StatCard label="Bulk SMS Rate" value="0.45 /sms" color="purple" />
      </div> */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total SMS Sent", value: "1834" },
          { label: "Total SMS Cost (BDT)", value: "825.3" },
          {
            label: "SMS Balance",
            custom: (
              <>
                <div className="text-3xl font-bold">0.00</div>
                <input
                  placeholder="Enter amount"
                  className="mt-2 p-2 w-full border rounded-md"
                />
                <p className="text-[12px] text-red-500 mt-1">
                  Minimum Top Up 500 Taka
                </p>
                <button className="mt-2 w-full py-2 rounded-md text-white bg-primary hover:bg-[#0caed8] transition">
                  Top Up SMS
                </button>
              </>
            ),
          },
          {
            label: "Bulk SMS Rate",
            custom: (
              <div className="text-3xl font-bold">
                0.45 <span className="text-lg">/sms</span>
              </div>
            ),
          },
        ].map(({ label, value, custom }, i) => (
          <div
            key={i}
            className="bg-[#e6f8fc] rounded-2xl p-6 text-center shadow-sm border"
          >
            <p className="text-slate-600 font-medium mb-2">{label}</p>
            {custom ?? (
              <div className="text-4xl font-bold text-slate-900">{value}</div>
            )}
          </div>
        ))}
      </div> */}

      {/* Order Status Configuration Section */}
      <div className="grid grid-cols-3 gap-6 m-4">
        {/* Toggle Switch Panel */}
        <OrderStatusToggle data={data} />

        {/* Right: Message Editor */}
        <div className="col-span-2">
          <OrderStatusMessage savedMessages={data} />
        </div>
      </div>
      {/* MultiSelect Component and Message editor*/}
      {/* <Card className="m-4">
        <MultiSelectStatus />
      </Card> */}
    </div>
  );
}
