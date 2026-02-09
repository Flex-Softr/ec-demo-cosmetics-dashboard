import { TOrders } from "@/types/order.interface";

const InvoiceSummary = ({ order }: { order: TOrders }) => {
  return (
    <div className="flex justify-between gap-12 w-full max-w-[60%] ml-auto">
      {/* <div className="flex-1">
        {order.invoiceNotes && (
          <div className="bg-gray-50 p-4 rounded-md text-sm border border-gray-100">
            <p className="font-semibold text-gray-900 mb-1">Note:</p>
            <p className="text-gray-900 italic">{order.invoiceNotes}</p>
          </div>
        )}
      </div> */}
      <div className="w-full space-y-2 text-sm text-gray-700">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Subtotal</span>
          <span className="font-semibold text-gray-900">
            {order?.subtotal ?? "0"}
          </span>
        </div>

        {/* Discount */}
        {order?.discount > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span className="font-medium">Discount</span>
            <span>- {order.discount}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Shipping</span>
          <span className="font-semibold text-gray-900 opacity-80 decoration-dashed underline underline-offset-4">
            {order?.shippingCharge?.amount ?? "0"}
          </span>
        </div>

        {/* Advance */}
        {order?.advance > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="font-medium">Advance</span>
            <span>- {order.advance}</span>
          </div>
        )}

        <div className="border-t border-gray-200 my-2"></div>

        {/* Total */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-100">
          <span className="font-bold text-gray-900 text-lg">Total</span>
          <span className="font-bold text-primary text-lg">
            {order?.total ?? "0"}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1 text-xs text-gray-900">
          <span>Payment Method:</span>
          <span className="font-medium capitalize">
            {order.payment?.paymentMethod?.name || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="font-bold text-gray-800">Due Amount:</span>
          <span className="font-bold text-gray-900">
            {(order?.total || 0) - (order?.advance || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
