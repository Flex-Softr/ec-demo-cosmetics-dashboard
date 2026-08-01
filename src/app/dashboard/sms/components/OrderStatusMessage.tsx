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
      if (!currentMessage) return prev;

      const currentMediums = currentMessage.activeMedium || [];
      const isActive = currentMediums.includes(medium);
      const newMediums = isActive
        ? currentMediums.filter((m) => m !== medium)
        : [...currentMediums, medium];

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
        toast({
          title: "Please enter a message before saving.",
          variant: "destructive",
        });
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
    } catch {
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
    <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3 md:gap-5">
      <div className="space-y-2">
        {statusList.map(({ slug, status }: any) => (
          <Button
            key={slug}
            onClick={() => handleStatusClick(slug)}
            className={cn(
              "w-full justify-start rounded-lg px-4 py-2 text-left transition-colors",
              selectedStatus === slug
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-border bg-muted/40 text-foreground hover:bg-muted"
            )}
            variant="ghost"
          >
            {status}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {hasMounted && (
          <motion.div
            key={selectedStatus}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 rounded-xl border border-border bg-muted/30 p-4 md:col-span-2 md:p-5"
          >
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Notification Channels
              </Label>
              <div className="flex flex-wrap gap-2">
                {mediums.map((m) => {
                  const isActive = currentData.activeMedium?.includes(m.value);
                  return (
                    <Badge
                      key={m.value}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer select-none rounded-lg px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
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
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Email Subject
              </Label>
              <Input
                id="email-subject"
                className="rounded-lg"
                placeholder="Enter email subject (optional)…"
                value={currentData.emailSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <Label
                  htmlFor="message-body"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Message Body
                </Label>
                <span
                  className={cn(
                    "text-xs font-medium",
                    smsCount > 1 ? "text-amber-600" : "text-muted-foreground"
                  )}
                >
                  {charCount} char | {smsCount} SMS
                </span>
              </div>
              <p className="rounded-lg border border-border bg-card p-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Variables:
                </span>{" "}
                <code>{`{fullName}, {orderId}, {trackingUrl}, {total}, {break}`}</code>
              </p>
              <Textarea
                id="message-body"
                className="min-h-[160px] w-full resize-y rounded-lg p-4"
                value={currentData.customTemplate}
                onChange={(e) => handleMessageChange(e.target.value)}
                placeholder="Enter your message template here…"
              />
              <p className="mt-1 text-[10px] italic text-muted-foreground">
                * Special characters like ~ ^ &#123;&#125; [ ] | reduce char
                limit per SMS to 70.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={saveMessage}
                disabled={isLoading || loading}
                size="sm"
                className="rounded-lg px-6"
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
