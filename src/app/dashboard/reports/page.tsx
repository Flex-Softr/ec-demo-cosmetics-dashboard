import PageTitle from "@/components/pageTitle/PageTitle";
import BestSellingProducts from "./components/BestSellingProducts/BestSellingProducts";
import OrdersCount from "./components/ordersCounts/OrdersCount";
import OrderStatusChangeCount from "./components/OrderStatusChangeCount/OrderStatusChangeCount";
import SalesByPlatform from "./components/SalesByPlatform/SalesByPlatform";
import Stats from "./components/stats/Stats";

const Reports = () => {
  return (
    <div className="p-4">
      <PageTitle title="Reports" />
      <div className="flex flex-col gap-5">
        <Stats />
        <div className="grid grid-cols-3 gap-5">
          <OrdersCount />
          <SalesByPlatform />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <OrderStatusChangeCount />
          <BestSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default Reports;
