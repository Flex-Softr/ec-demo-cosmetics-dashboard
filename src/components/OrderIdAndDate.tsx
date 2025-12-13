"use client";
import React, { useState, useEffect } from "react";
type TProps = {
  orderId?: string;
  timestamp: string | Date;
  className?: string;
};
function formatDate(timestamp: string | Date) {
  const date = new Date(timestamp);
  // Extract hours, minutes, and seconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // Format time
  // const formattedHours = hours > 12 ? hours - 12 : hours;
  const formattedHours = hours % 12 || 12;
  const amPm = hours >= 12 ? "pm" : "am";
  const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amPm}`;
  // Format date
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is 0-indexed
  const year = date.getFullYear() % 100; // Get last two digits of the year
  const formattedDate = `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""}${month}/${year}`;
  return { formattedTime, formattedDate };
}

function OrderIdAndDate({ orderId, timestamp, className }: TProps) {
  const { formattedTime, formattedDate } = formatDate(timestamp);
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup function
  }, []); // Runs only once on component mount
  const timeDifference = Math.floor(
    (currentTime.getTime() - new Date(timestamp).getTime()) / 1000
  ); // Difference in seconds

  let timeAgo;
  if (timeDifference < 60) {
    timeAgo = "Just now";
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    timeAgo = `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    timeAgo = `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 604800) {
    const days = Math.floor(timeDifference / 86400);
    timeAgo = `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 2629800) {
    const weeks = Math.floor(timeDifference / 604800);
    timeAgo = `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 31557600) {
    const months = Math.floor(timeDifference / 2629800);
    timeAgo = `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(timeDifference / 31557600);
    timeAgo = `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  return (
    <div className={`${className}`}>
      <span>{orderId}</span>
      <span>{formattedTime}</span>
      <span>{formattedDate}</span>
      <span>{timeAgo}</span>
    </div>
  );
}

export default OrderIdAndDate;
