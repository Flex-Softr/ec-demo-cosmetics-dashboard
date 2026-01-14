import { Card } from "@/components/ui/card";
import { TStats } from "@/redux/features/reports/reportsInterface";
import {
  DollarSign,
  LucideIcon,
  Package,
  Percent,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const iconMap: Record<string, LucideIcon> = {
  "Total Sales": DollarSign,
  Sales: DollarSign,
  "Total Orders": ShoppingCart,
  Orders: ShoppingCart,
  "Total Customers": Users,
  Customers: Users,
  "Total Products": Package,
  Products: Package,
  Discount: Percent,
  "Total Discount": Percent,
};

const StatsCard = ({ stat }: { stat: TStats }) => {
  const Icon = iconMap[stat.title] || Package;

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border bg-white/50 backdrop-blur-sm group">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-gray-500 tracking-wide uppercase group-hover:text-primary transition-colors">
          {stat.title}
        </h3>
        <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="space-y-1">
        <div
          className={`text-2xl font-bold text-gray-900 ${montserrat.className}`}
        >
          {stat.count || 0}
        </div>
        <p className={`text-xs text-gray-500 ${montserrat.className}`}>
          {stat.description}
        </p>
      </div>
    </Card>
  );
};
export default StatsCard;
