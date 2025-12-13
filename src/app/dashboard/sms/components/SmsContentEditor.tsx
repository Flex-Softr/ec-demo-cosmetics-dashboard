"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getSmsCount } from "@/lib/getSmsCount";
import { useSendBulkSMSMutation } from "@/redux/features/sms/smsApi";
import React, { useState } from "react";

// const sampleData = {
//   customerName: "Romjan",
//   orderNo: "12345",
//   orderStatus: "Delivered",
//   break: "\n",
// };

export default function SmsContentEditor({
  mobileNumbers,
}: {
  mobileNumbers: string[];
}) {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  // const [showPreview, setShowPreview] = useState(false);

  const [sendBulkSMS, { isLoading }] = useSendBulkSMSMutation();
  // const contentExample = `Hello {customerName}, {break}Your order #{orderNo} is {orderStatus}. Thank you for shopping with us!`;

  // const preview = generatePreview(content);
  // const preview = generatePreview(contentExample);

  // const charCount = preview.length;

  const { charCount, smsCount } = getSmsCount(content);

  const handleSend = async () => {
    try {
      if (content.trim().length === 0) {
        alert("Please enter SMS content.");
        return;
      }
      if (mobileNumbers.length === 0) {
        alert("Please select at least one mobile number.");
        return;
      }

      const isValidBDNumber = (num: string) => /^01[0-9]{9}$/.test(num);
      const invalidNum = mobileNumbers.find((num) => !isValidBDNumber(num));

      if (invalidNum) {
        toast({
          title: "Invalid Number",
          description: `Please enter a valid number: ${invalidNum}`,
          variant: "destructive",
        });
        return;
      }

      if (content.length > 1600) {
        alert("SMS content exceeds the maximum limit of 1600 characters.");
        return;
      }

      await sendBulkSMS({
        mobileNumbers,
        messageBody: content,
      });

      setContent("");

      toast({
        title: "SMS sent successfully!",
        className: "bg-success text-white text-2xl",
      });
    } catch (error) {
      toast({
        title: "Failed to send SMS. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border">
      <label className="block font-semibold text-slate-800">
        Enter SMS Content
      </label>
      <p className="text-sm text-slate-500 mb-2">
        1 SMS = 160 characters (English) or 70 characters (other languages).
        Special characters like ~ ^ &#123;&#125; [ ] | reduce the limit to 70
        characters. Please check your message length before sending.
      </p>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-32 p-3 border rounded-lg outline-none focus:ring-2"
        // placeholder="e.g. Hello {customerName}, {break}Your order #{orderNo} is {orderStatus}. Thank you for shopping with us!"
        placeholder="Enter your SMS content here..."
      />

      <div className="text-sm text-slate-500 my-2">
        {charCount} character{charCount !== 1 && "s"}, {smsCount} SMS, Total SMS{" "}
        {smsCount * mobileNumbers.length}
        {/* <Button
          onClick={() => setShowPreview(!showPreview)}
          className="transition bg-gray-300 ml-5 text-gray-700 py-1 hover:bg-gray-400"
          size={"sm"}
        >
          {showPreview ? "Hide Preview" : "Preview Message"}
        </Button> */}
      </div>

      {/* {showPreview && (
        <div className="mt-4">
          <h3 className="font-bold text-slate-700 mb-1">Message Preview:</h3>
          <div className="whitespace-pre-wrap p-3 border rounded-md bg-gray-50 text-gray-800">
            {preview}
          </div>
        </div>
      )} */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className={`cursor-pointer font-medium rounded-full w-[400px] mx-auto `}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
