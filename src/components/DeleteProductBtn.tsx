"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDeleteProductsMutation } from "@/redux/features/products/productsApi";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const DeleteProductBtn = ({
  id,
  children,
  className,
  title,
  variant,
  size,
}: {
  id: string;
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
  const [deleteProducts, { isLoading }] = useDeleteProductsMutation();

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await deleteProducts([productId]).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "The product deleted successfully!",
        });
        router.push("/dashboard/products");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete the product!",
        });
      }
    }
  };

  return (
    <div className="flex justify-end">
      <Button
        onClick={() => handleDelete(id)}
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

export default DeleteProductBtn;
