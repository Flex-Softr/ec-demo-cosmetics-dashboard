"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRefreshCourierOrdersMutation } from "@/redux/features/monitorDelivery/monitorDeliveryApi";

const RefreshCourier = () => {
  const { toast } = useToast();
  const [refreshCourierOrders, { isLoading }] =
    useRefreshCourierOrdersMutation();

  const handleClick = async () => {
    try {
      await refreshCourierOrders(undefined);
      toast({
        className: "bg-success text-white text-2xl",
        title: "Successfully refreshed!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Refresh failed! Something went wrong.",
      });
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      Refresh
    </Button>
  );
};

export default RefreshCourier;
