"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TProps = {
  orderId?: string;
  _id?: string;
  timestamp: string | Date;
  className?: string;
  hideOrderId?: boolean;
};

function formatDate(timestamp: string | Date) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 || 12;
  const amPm = hours >= 12 ? "pm" : "am";
  const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amPm}`;
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return { formattedTime, formattedDate };
}

function getTimeAgo(timestamp: string | Date, currentTime: Date) {
  const diff = Math.floor(
    (currentTime.getTime() - new Date(timestamp).getTime()) / 1000
  );
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2629800) return `${Math.floor(diff / 604800)}w ago`;
  if (diff < 31557600) return `${Math.floor(diff / 2629800)}mo ago`;
  return `${Math.floor(diff / 31557600)}y ago`;
}

function OrderIdAndDate({
  orderId,
  _id,
  timestamp,
  className,
  hideOrderId,
}: TProps) {
  const { formattedTime, formattedDate } = formatDate(timestamp);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const timeAgo = getTimeAgo(timestamp, currentTime);

  return (
    <div className={cn("flex flex-col gap-0.5 text-left", className)}>
      {!hideOrderId && orderId && (
        <>
          {_id ? (
            <Link
              href={`/dashboard/orders/${_id}`}
              className="text-sm font-semibold text-primary hover:underline leading-snug whitespace-nowrap"
            >
              #{orderId}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-primary leading-snug whitespace-nowrap">
              #{orderId}
            </span>
          )}
        </>
      )}
      <span className="text-xs text-foreground/80 tabular-nums whitespace-nowrap">
        {formattedDate}
      </span>
      <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
        {formattedTime} · {timeAgo}
      </span>
    </div>
  );
}

export default OrderIdAndDate;
