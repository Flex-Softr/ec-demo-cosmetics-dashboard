"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateOrderSMSMutation,
  useUpdateOrderSMSMutation,
} from "@/redux/features/sms/smsApi";
import { refetchData } from "@/utilities/fetchData";
import { messageTemplate, statusList, Message } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { getSmsCount } from "@/lib/getSmsCount";

type MessageMap = { [key: string]: string };

export default function OrderStatusMessage({
  savedMessages = [],
}: {
  savedMessages: Message[];
}) {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("order_created");
  const [messages, setMessages] = useState<MessageMap>({
    order_created: "",
    order_confirmed: "",
    order_canceled: "",
    shifted: "",
    courier_assigned: "",
    // delivered: "",
    // order_returned: "",
  });

  const [hasMounted, setHasMounted] = useState(false);

  const [createOrderSMS, { isLoading }] = useCreateOrderSMSMutation();
  const [updateOrderSMS, { isLoading: loading }] = useUpdateOrderSMSMutation();

  useEffect(() => {
    const initialMessages = savedMessages?.reduce(
      (acc: Record<string, string>, item: Message) => {
        const { slug, customTemplate } = item;
        acc[slug] = customTemplate || "";
        return acc;
      },
      { ...messages }
    );

    if (initialMessages) {
      setMessages(initialMessages);
    }

    setHasMounted(true); // Prevent initial animation flash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedMessages]);

  const handleStatusClick = (slug: string) => {
    setSelectedStatus(slug);
  };

  const handleInputChange = (text: string) => {
    setMessages((prev) => ({
      ...prev,
      [selectedStatus]: text,
    }));
  };

  const saveMessage = async () => {
    try {
      const id = savedMessages.find(
        (item) => item.slug === selectedStatus
      )?._id;
      const messageText = messages[selectedStatus];

      if (!messageText && !id) {
        alert("Please enter a message before saving.");
        return;
      }

      const payload = {
        notificationData: [
          {
            slug: selectedStatus,
            ...messageTemplate(messageText, selectedStatus),
          },
        ],
      };

      if (id) {
        await updateOrderSMS({
          payload: messageTemplate(messageText, selectedStatus),
          _id: id,
        }).unwrap();

        toast({
          title: "SMS template updated successfully!",
          className: "bg-success text-white text-2xl",
        });
      } else {
        await createOrderSMS(payload).unwrap();
        toast({
          title: "SMS template created successfully!",
          className: "bg-success text-white text-2xl",
        });
      }

      refetchData("order-sms-notification");
    } catch (error) {
      toast({
        title: "Failed to save message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { charCount, smsCount } = getSmsCount(messages[selectedStatus]);

  return (
    <div className="grid grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-sm border">
      {/* Left Panel - Status Selector */}
      <div className="space-y-4">
        {statusList.map(({ slug, status }) => (
          <Button
            key={slug}
            onClick={() => handleStatusClick(slug)}
            className={`w-full text-left justify-start px-4 py-2 rounded-lg ${
              selectedStatus === slug
                ? "bg-primary hover:bg-primary text-white"
                : "bg-purple-50 text-gray-800 hover:bg-primary hover:text-white"
            }`}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Right Panel - Message Input with animation */}
      <AnimatePresence mode="wait">
        {hasMounted && (
          <motion.div
            key={selectedStatus}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-purple-50 rounded-xl h-full col-span-2 p-4 shadow"
          >
            <h3 className="font-semibold mb-1">Enter Order Status Message</h3>
            <p className="text-sm text-gray-500 mb-3">
              Hint: Use variables like{" "}
              <code>{`{fullName}, {orderId}, {trackingUrl}, {total}, {break}`}</code>
            </p>
            <Textarea
              className="w-full p-3 min-h-40 border rounded"
              value={messages[selectedStatus]}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your message here..."
            />
            <p
              className="text-sm text-slate-500 mt-1"
              title="1 SMS = 160 characters in English and 1 SMS = 70 characters in other languages or special characters like ~ ^ &#123;&#125; [ ] |"
            >
              {charCount} character{charCount !== 1 && "s"}, Total {smsCount}{" "}
              SMS
            </p>
            <div className="flex justify-center mt-4">
              <Button
                onClick={saveMessage}
                disabled={isLoading || loading}
                className="w-60 mt-4 rounded-full"
              >
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
