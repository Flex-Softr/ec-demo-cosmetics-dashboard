"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDeleteOrdersMutation } from "@/redux/features/orders/ordersApi";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const DeleteOrderBtn = ({
  _id,
  children,
  className,
  title,
  variant,
  size,
}: {
  _id: string;
  children: ReactNode;
  className?: string;
  title?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const router = useRouter();
  const [deleteOrder, { isLoading }] = useDeleteOrdersMutation();
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      try {
        await deleteOrder([id]).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "The order deleted successfully!",
        });
        router.push("/dashboard/orders");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete the order!",
        });
      }
    }
  };

  return (
    <div className="flex justify-end">
      <Button
        onClick={() => handleDelete(_id)}
        disabled={isLoading}
        variant={variant}
        className={className}
        size={size}
        title={title}
      >
        {children}
      </Button>
    </div>
  );
};

export default DeleteOrderBtn;
