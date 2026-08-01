"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useGetSalesByCategoryQuery,
  useGetSalesByPaymentsQuery,
  useGetSalesByProductQuery,
  useGetSalesOrdersQuery,
  useGetSalesSummaryQuery,
} from "@/redux/features/reports/reportsApi";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

const SalesReport = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const filters = useMemo(
    () => ({
      from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
    }),
    [date]
  );

  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetSalesSummaryQuery(filters);
  const { data: ordersData, isLoading: isOrdersLoading } =
    useGetSalesOrdersQuery(filters);
  const { data: productsData, isLoading: isProductsLoading } =
    useGetSalesByProductQuery(filters);
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetSalesByCategoryQuery(filters);
  const { data: paymentsData, isLoading: isPaymentsLoading } =
    useGetSalesByPaymentsQuery(filters);

  const summary = summaryData?.data;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-white/50 backdrop-blur-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-700">Filter by date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 rounded-lg gap-2 text-sm font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                {date?.from ? (
                  date.to ? (
                    <span>
                      {format(date.from, "MMM dd")} –{" "}
                      {format(date.to, "MMM dd, yyyy")}
                    </span>
                  ) : (
                    format(date.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span className="text-muted-foreground">
                    Pick a date range
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Gross Sales"
          value={summary?.gross_sales || 0}
          isCurrency
          isLoading={isSummaryLoading}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="Net Sales"
          value={summary?.net_sales || 0}
          isCurrency
          isLoading={isSummaryLoading}
          icon={<Wallet className="h-4 w-4" />}
          iconBg="bg-primary/10 text-primary"
        />
        <StatCard
          title="Total Orders"
          value={summary?.total_orders || 0}
          isLoading={isSummaryLoading}
          icon={<ShoppingCart className="h-4 w-4" />}
          iconBg="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="Refunded"
          value={summary?.refund_amount || 0}
          isCurrency
          isLoading={isSummaryLoading}
          icon={<RotateCcw className="h-4 w-4" />}
          iconBg="bg-red-500/10 text-red-500"
          valueColor="text-red-500"
        />
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <div className="rounded-xl border bg-white/50 backdrop-blur-sm overflow-hidden">
          <div className="px-4 pt-4">
            <TabsList className="h-9 rounded-lg bg-muted border p-0.5 gap-0.5">
              {["summary", "orders", "products", "categories", "payments"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="h-8 px-3 rounded-md text-xs font-medium capitalize"
                  >
                    {tab === "products"
                      ? "By Product"
                      : tab === "categories"
                        ? "By Category"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </div>

          <TabsContent value="summary" className="p-5 mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricBlock
                label="Discount Total"
                value={summary?.discount_total || 0}
                isLoading={isSummaryLoading}
              />
              <MetricBlock
                label="Paid Amount"
                value={summary?.paid_amount || 0}
                isLoading={isSummaryLoading}
                valueColor="text-green-600"
              />
              <MetricBlock
                label="Due Amount"
                value={summary?.due_amount || 0}
                isLoading={isSummaryLoading}
                valueColor="text-red-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <ReportTable
              isLoading={isOrdersLoading}
              colSpan={7}
              headers={[
                "Invoice No",
                "Customer",
                "Grand Total",
                "Paid",
                "Due",
                "Status",
                "Date",
              ]}
              empty={!ordersData?.data?.length}
            >
              {ordersData?.data?.map((order) => (
                <TableRow key={order.order_id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-primary hover:underline">
                    <Link href={`/dashboard/orders/${order.order_id}`}>
                      {order.invoice_no}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium text-gray-900">
                        {order.customer_name || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customer_phone || ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    ৳{order.grand_total.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ৳{order.paid_total.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-medium",
                      order.due_total > 0 ? "text-red-500" : "text-gray-400"
                    )}
                  >
                    ৳{order.due_total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        order.payment_status === "paid"
                          ? "bg-green-500/10 text-green-600"
                          : order.payment_status === "partial"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {format(new Date(order.created_at), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </ReportTable>
          </TabsContent>

          <TabsContent value="products" className="mt-0">
            <ReportTable
              isLoading={isProductsLoading}
              colSpan={4}
              headers={["Product Name", "SKU", "Qty Sold", "Total Sales"]}
              empty={!productsData?.data?.length}
              rightAlignLast={2}
            >
              {productsData?.data?.map((item) => (
                <TableRow key={item.product_id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-gray-900">
                    {item.product_name}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {item.sku || "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-900">
                    {item.quantity_sold}
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    ৳{item.total_sales.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </ReportTable>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <ReportTable
              isLoading={isCategoriesLoading}
              colSpan={3}
              headers={["Category Name", "Qty Sold", "Total Sales"]}
              empty={!categoriesData?.data?.length}
              rightAlignLast={2}
            >
              {categoriesData?.data?.map((item) => (
                <TableRow key={item.category_id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-gray-900">
                    {item.category_name}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-900">
                    {item.quantity_sold}
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    ৳{item.total_sales.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </ReportTable>
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <ReportTable
              isLoading={isPaymentsLoading}
              colSpan={4}
              headers={[
                "Method",
                "Total Received",
                "Total Refunded",
                "Net Received",
              ]}
              empty={!paymentsData?.data?.length}
              rightAlignLast={3}
            >
              {paymentsData?.data?.map((item) => (
                <TableRow key={item.method_id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-gray-900">
                    {item.method_name}
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    ৳{item.total_received.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-500 font-medium">
                    ৳{item.total_refunded.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900">
                    ৳
                    {(
                      item.total_received - item.total_refunded
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </ReportTable>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  isCurrency = false,
  isLoading = false,
  icon,
  iconBg,
  valueColor,
}: {
  title: string;
  value: number;
  isCurrency?: boolean;
  isLoading?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}) => (
  <div className="rounded-xl border bg-white/50 backdrop-blur-sm p-5 space-y-3 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <div
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          iconBg
        )}
      >
        {icon}
      </div>
    </div>
    {isLoading ? (
      <div className="h-8 w-28 bg-muted animate-pulse rounded-lg" />
    ) : (
      <p className={cn("text-2xl font-bold text-gray-900", valueColor)}>
        {isCurrency ? "৳" : ""}
        {value.toLocaleString()}
      </p>
    )}
  </div>
);

const MetricBlock = ({
  label,
  value,
  isLoading,
  valueColor,
}: {
  label: string;
  value: number;
  isLoading: boolean;
  valueColor?: string;
}) => (
  <div className="rounded-xl border bg-muted/40 p-4 space-y-1">
    <p className="text-xs text-gray-500 font-medium">{label}</p>
    {isLoading ? (
      <div className="h-7 w-24 bg-muted animate-pulse rounded" />
    ) : (
      <p className={cn("text-xl font-bold text-gray-900", valueColor)}>
        ৳{value.toLocaleString()}
      </p>
    )}
  </div>
);

const ReportTable = ({
  isLoading,
  colSpan,
  headers,
  empty,
  children,
  rightAlignLast = 0,
}: {
  isLoading: boolean;
  colSpan: number;
  headers: string[];
  empty: boolean;
  children?: React.ReactNode;
  rightAlignLast?: number;
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {headers.map((h, i) => (
            <TableHead
              key={h}
              className={cn(
                "text-xs font-semibold text-gray-500 bg-muted/50 first:pl-5 last:pr-5",
                rightAlignLast > 0 && i >= headers.length - rightAlignLast
                  ? "text-right"
                  : ""
              )}
            >
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={colSpan}
              className="text-center py-10 text-gray-500 text-sm"
            >
              Loading...
            </TableCell>
          </TableRow>
        ) : empty ? (
          <TableRow>
            <TableCell
              colSpan={colSpan}
              className="text-center py-10 text-gray-500 text-sm"
            >
              No data found for the selected period.
            </TableCell>
          </TableRow>
        ) : (
          children
        )}
      </TableBody>
    </Table>
  </div>
);

export default SalesReport;
