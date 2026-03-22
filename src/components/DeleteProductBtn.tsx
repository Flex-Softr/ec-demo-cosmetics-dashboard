"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDeleteProductsMutation } from "@/redux/features/products/productsApi";
import { revalidateTag } from "@/utilities/revalidate";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type DeleteProductBtnProps = {
  id: string;
  slug: string;
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
};

import CommonAlertDialog from "./common/CommonAlertDialog";

const DeleteProductBtn = ({
  id,
  slug,
  children,
  className,
  title,
  variant,
  size,
}: DeleteProductBtnProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteProducts, { isLoading }] = useDeleteProductsMutation();

  const handleRevalidate = async (slug: string) => {
    await revalidateTag([
      `product-${slug}`,
      `relatedProducts-${slug}`,
      `collectionProducts-${slug}`,
      "featuredProducts",
      "bestSellingProducts",
      "categories",
      "homepageIndividualSection",
    ]);
  };

  const handleDelete = async () => {
    try {
      await deleteProducts([id]).unwrap();
      toast({
        className: "bg-success text-white text-2xl",
        title: "The product deleted successfully!",
      });
      handleRevalidate(slug);
      router.push("/dashboard/products");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete the product!",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="flex justify-end mt-5">
      <CommonAlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete the product from the server."
        onConfirm={handleDelete}
        loading={isLoading}
        confirmVariant="destructive"
      />
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
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
