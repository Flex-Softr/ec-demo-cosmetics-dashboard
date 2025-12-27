/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { TImageToOrderReq } from "@/redux/features/imageToOrder/imageToOrderInterface";
import { Plus } from "lucide-react";
import Link from "next/link";

const CreateNewOrder = ({ reqData }: { reqData: TImageToOrderReq }) => {
  return (
    <Link href={`/dashboard/image-to-order/create?id=${reqData._id}`}>
      <Button className="rounded-2xl">
        <Plus /> Create Order
      </Button>
    </Link>
  );
};

export default CreateNewOrder;
