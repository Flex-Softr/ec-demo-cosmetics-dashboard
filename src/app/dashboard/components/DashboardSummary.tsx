"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardSummaryQuery } from "@/redux/features/dashboard/dashboardApi";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const cards = [
  {
    key: "orders" as const,
    title: "Total Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    iconBg: "bg-blue-500/10 text-blue-600",
  },
  {
    key: "sales" as const,
    title: "Total Sales",
    href: "/dashboard/orders",
    icon: TrendingUp,
    iconBg: "bg-green-500/10 text-green-600",
    currency: true,
  },
  {
    key: "products" as const,
    title: "Total Products",
    href: "/dashboard/products",
    icon: Package,
    iconBg: "bg-purple-500/10 text-purple-600",
  },
  {
    key: "customers" as const,
    title: "Total Customers",
    href: "/dashboard/customers",
    icon: Users,
    iconBg: "bg-orange-500/10 text-orange-600",
  },
];

const DashboardSummary = () => {
  const { data, isLoading } = useGetDashboardSummaryQuery();
  const summary = data?.data;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) =>
        isLoading ? (
          <SummarySkeleton key={card.key} />
        ) : (
          <Link key={card.key} href={card.href}>
            <div className="rounded-xl border bg-white/50 backdrop-blur-sm p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide group-hover:text-primary transition-colors">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.currency ? "৳" : ""}
                    {(summary?.[card.key] ?? 0).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  );
};

const SummarySkeleton = () => (
  <div className="rounded-xl border bg-white/50 backdrop-blur-sm p-5">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="w-24 h-3.5" />
        <Skeleton className="w-20 h-7 mt-2" />
      </div>
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  </div>
);

export default DashboardSummary;
