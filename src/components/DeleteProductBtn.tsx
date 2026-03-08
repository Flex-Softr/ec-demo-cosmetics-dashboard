"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDeleteProductsMutation } from "@/redux/features/products/productsApi";
import { revalidateTag } from "@/utilities/revalidate";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

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
  const [deleteProducts, { isLoading }] = useDeleteProductsMutation();

  const handleRevalidate = async (slug: string) => {
    await revalidateTag([
      `product-${slug}`,
      `relatedProducts-${slug}`,
      `collectionProducts-${slug}`,
      "featuredProducts",
      "bestSellingProducts",
      "allCategories",
      "homepageIndividualSection",
    ]);
  };

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
        handleRevalidate(slug);
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
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(id);
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
