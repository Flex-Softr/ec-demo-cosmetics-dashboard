/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getSmsCount } from "@/lib/getSmsCount";
import { cn } from "@/lib/utils";
import {
  useCreateOrderSMSMutation,
  useUpdateOrderSMSMutation,
} from "@/redux/features/sms/smsApi";
import { refetchData } from "@/utilities/fetchData";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Message,
  messageTemplate,
  statusList,
  TOrderSMSNotificationMediumType,
} from "../lib/utils";

type MessageState = {
  customTemplate: string;
  activeMedium: TOrderSMSNotificationMediumType[];
  emailSubject: string;
};

type MessageMap = { [key: string]: MessageState };

const defaultMediums: TOrderSMSNotificationMediumType[] = ["phone"];

const initialMessageState: MessageState = {
  customTemplate: "",
  activeMedium: defaultMediums,
  emailSubject: "",
};

export default function OrderStatusMessage({
  savedMessages = [],
}: {
  savedMessages: Message[];
}) {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("order_created");

  // Initialize state with all status keys
  const [messages, setMessages] = useState<MessageMap>(() => {
    const initial: MessageMap = {};
    statusList.forEach((s: any) => {
      initial[s.slug] = { ...initialMessageState };
    });
    return initial;
  });

  const [hasMounted, setHasMounted] = useState(false);

  const [createOrderSMS, { isLoading }] = useCreateOrderSMSMutation();
  const [updateOrderSMS, { isLoading: loading }] = useUpdateOrderSMSMutation();

  useEffect(() => {
    const updatedMessages: MessageMap = {};
    statusList.forEach((s: any) => {
      updatedMessages[s.slug] = { ...initialMessageState };
    });

    savedMessages?.forEach((item: Message) => {
      const { slug, customTemplate, activeMedium, emailSubject } = item;
      // Find matching status in statusList to ensure valid slug
      const isValidSlug = statusList.some((s: any) => s.slug === slug);
      if (isValidSlug) {
        updatedMessages[slug] = {
          customTemplate: customTemplate || "",
          activeMedium: activeMedium || defaultMediums,
          emailSubject: emailSubject || "",
        };
      }
    });

    setMessages((prev) => ({ ...prev, ...updatedMessages }));
    setHasMounted(true);
  }, [savedMessages]);

  const handleStatusClick = (slug: string) => {
    setSelectedStatus(slug);
  };

  const handleMessageChange = (text: string) => {
    setMessages((prev) => ({
      ...prev,
      [selectedStatus]: {
        ...prev[selectedStatus],
        customTemplate: text,
      },
    }));
  };

  const handleSubjectChange = (text: string) => {
    setMessages((prev) => ({
      ...prev,
      [selectedStatus]: {
        ...prev[selectedStatus],
        emailSubject: text,
      },
    }));
  };

  const toggleMedium = (medium: TOrderSMSNotificationMediumType) => {
    setMessages((prev) => {
      const currentMessage = prev[selectedStatus];
      if (!currentMessage) return prev; // Should not happen

      const currentMediums = currentMessage.activeMedium || [];
      const isActive = currentMediums.includes(medium);
      let newMediums;

      if (isActive) {
        newMediums = currentMediums.filter((m) => m !== medium);
      } else {
        newMediums = [...currentMediums, medium];
      }

      return {
        ...prev,
        [selectedStatus]: {
          ...currentMessage,
          activeMedium: newMediums,
        },
      };
    });
  };

  const saveMessage = async () => {
    try {
      const id = savedMessages.find(
        (item) => item.slug === selectedStatus
      )?._id;

      const currentMessageState = messages[selectedStatus];
      const { customTemplate, activeMedium, emailSubject } =
        currentMessageState;

      if (!customTemplate && !id) {
        alert("Please enter a message before saving.");
        return;
      }

      const payloadData = {
        slug: selectedStatus,
        ...messageTemplate(customTemplate, selectedStatus),
        activeMedium,
        emailSubject,
      };

      const payload = {
        notificationData: [payloadData],
      };

      if (id) {
        await updateOrderSMS({
          payload: payloadData,
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

  const currentData = messages[selectedStatus] || initialMessageState;
  const { charCount, smsCount } = getSmsCount(currentData.customTemplate);

  const mediums: { value: TOrderSMSNotificationMediumType; label: string }[] = [
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
    { value: "whatsapp", label: "WhatsApp" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-xl shadow-sm border">
      {/* Left Panel - Status Selector */}
      <div className="space-y-4">
        {statusList.map(({ slug, status }: any) => (
          <Button
            key={slug}
            onClick={() => handleStatusClick(slug)}
            className={cn(
              "w-full text-left justify-start px-4 py-2 rounded-lg transition-colors",
              selectedStatus === slug
                ? "bg-primary hover:bg-primary/90 text-white"
                : "bg-purple-50 text-gray-800 hover:bg-purple-100/50"
            )}
            variant="ghost"
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
            className="bg-purple-50 rounded-xl h-full md:col-span-2 p-4 md:p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Notifications Channels
              </Label>
              <div className="flex flex-wrap gap-2">
                {mediums.map((m) => {
                  const isActive = currentData.activeMedium?.includes(m.value);
                  return (
                    <Badge
                      key={m.value}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer px-4 py-1.5 text-sm select-none transition-all rounded-full hover:scale-105 active:scale-95",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                      )}
                      onClick={() => toggleMedium(m.value)}
                    >
                      {m.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email-subject"
                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
              >
                Email Subject
              </Label>
              <Input
                id="email-subject"
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg"
                placeholder="Enter email subject (optional)..."
                value={currentData.emailSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label
                  htmlFor="message-body"
                  className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  Message Body
                </Label>
                <span
                  className={cn(
                    "text-xs font-medium",
                    smsCount > 1 ? "text-amber-600" : "text-slate-400"
                  )}
                >
                  {charCount} char | {smsCount} SMS
                </span>
              </div>
              <p className="text-xs text-gray-500 bg-white/50 p-2 rounded border border-purple-100">
                <span className="font-semibold">Variables:</span>{" "}
                <code>{`{fullName}, {orderId}, {trackingUrl}, {total}, {break}`}</code>
              </p>
              <Textarea
                id="message-body"
                className="w-full p-4 min-h-[160px] border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-primary/20 transition-all resize-y"
                value={currentData.customTemplate}
                onChange={(e) => handleMessageChange(e.target.value)}
                placeholder="Enter your message template here..."
              />
              <p className="text-[10px] text-slate-400 mt-1 italic">
                * Special characters like ~ ^ &#123;&#125; [ ] | reduce char
                limit per SMS to 70.
              </p>
            </div>

            <div className="flex justify-start pt-2">
              <Button
                onClick={saveMessage}
                disabled={isLoading || loading}
                className="w-full sm:w-auto px-8 rounded-full font-medium"
              >
                {isLoading || loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
