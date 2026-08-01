"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateOrderSMSMutation,
  useUpdateOrderSMSMutation,
} from "@/redux/features/sms/smsApi";
import { refetchData } from "@/utilities/fetchData";
import { useEffect, useState } from "react";
import { Message, messageTemplate, statusList } from "../lib/utils";

export function OrderStatusToggle({ data = [] }: { data: Message[] }) {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<Message[]>(statusList);

  const [createOrderSMS] = useCreateOrderSMSMutation();
  const [updateOrderSMS] = useUpdateOrderSMSMutation();

  useEffect(() => {
    const updated = statusList.map((status) => {
      const match = data.find((item) => item.slug === status.slug);
      return {
        ...status,
        _id: match?._id ?? null,
        isActive: match?.isActive ?? false,
      };
    });

    setStatuses(updated);
  }, [data]);

  const handleToggle = async (checked: boolean, index: number) => {
    const status = statuses[index];
    const updatedStatuses = [...statuses];
    updatedStatuses[index].isUpdating = true;
    setStatuses(updatedStatuses);

    try {
      if (status._id) {
        await updateOrderSMS({
          _id: status._id,
          payload: { isActive: checked },
        }).unwrap();
      } else {
        await createOrderSMS({
          notificationData: [
            {
              slug: status.slug,
              isActive: checked,
              ...messageTemplate("", status.slug),
            },
          ],
        }).unwrap();
      }

      refetchData("order-sms-notification");

      toast({
        title: `${status.status} SMS status is now ${
          checked ? "enabled" : "disabled"
        }`,
        className: `${checked ? "bg-success" : "bg-red-500"} text-white text-2xl `,
      });
    } catch {
      toast({
        title: "Failed to change. Something went wrong! Please try again.",
        variant: "destructive",
      });
    } finally {
      updatedStatuses[index].isUpdating = false;
      setStatuses(updatedStatuses);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-none">
      <h2 className="text-base font-semibold text-foreground">
        Order Status Message
      </h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">
        Choose when you want to send your order status message
      </p>

      <div className="space-y-4">
        {statuses.map(({ slug, status, isActive, isUpdating }, idx) => (
          <div key={slug} className="flex items-center space-x-2">
            <Switch
              checked={!!isActive}
              onCheckedChange={(checked) => handleToggle(checked, idx)}
              disabled={isUpdating}
            />
            <Label className="text-sm text-foreground">{status}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
