import { TOrders } from "@/types/order.interface";

const InvoiceSummary = ({ order }: { order: TOrders }) => {
  return (
    <div className="flex justify-between gap-12 w-full max-w-[60%] ml-auto">
      {/* <div className="flex-1">
        {order.invoiceNotes && (
          <div className="bg-gray-50 p-4 rounded-md text-sm border border-gray-100">
            <p className="font-semibold text-black mb-1">Note:</p>
            <p className="text-black italic">{order.invoiceNotes}</p>
          </div>
        )}
      </div> */}
      <div className="w-full space-y-1 text-sm text-black">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-black">Subtotal</span>
          <span className="font-semibold text-black">
            {order?.subtotal ?? "0"}
          </span>
        </div>

        {/* Discount */}
        {order?.discount > 0 && (
          <div className="flex justify-between items-center text-black font-bold">
            <span className="font-medium">Discount</span>
            <span>- {order.discount}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-black">Shipping</span>
          <span className="font-semibold text-black">
            {order?.shippingCharge?.amount ?? "0"}
          </span>
        </div>

        {/* Advance */}
        {order?.advance > 0 && (
          <div className="flex justify-between items-center text-black font-bold">
            <span className="font-medium">Advance</span>
            <span>- {order.advance}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center border-t border-black mt-2 pt-2 px-1">
          <span className="font-bold text-black text-lg uppercase tracking-tight">
            Total
          </span>
          <span className="font-bold text-black text-xl">
            {order?.total ?? "0"}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1 text-xs text-black">
          <span>Payment Method:</span>
          <span className="font-medium capitalize text-black">
            {order.payment?.paymentMethod?.name || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="font-bold text-black">Due Amount:</span>
          <span className="font-bold text-black">
            {(order?.total || 0) - (order?.advance || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
