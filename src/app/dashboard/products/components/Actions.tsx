import CommonAlertDialog from "@/components/common/CommonAlertDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useDeleteProductsMutation } from "@/redux/features/products/productsApi";
import { revalidateTag } from "@/utilities/revalidate";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";

const Actions = ({ _id, slug }: { _id: string; slug: string }) => {
  const [open, setOpen] = useState(false);
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

  const handleDelete = async () => {
    try {
      await deleteProducts([_id]).unwrap();
      toast({
        className: "bg-success text-white text-2xl",
        title: "Product deleted successfully!",
      });
      handleRevalidate(slug);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed!",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 min-w-[90px]">
      <CommonAlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete the product from the server."
        onConfirm={handleDelete}
        loading={isLoading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="p-2 cursor-pointer">
            <DotsVerticalIcon className="h-4 w-4" />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`/dashboard/products/${_id}`}
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <span>View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-700 flex items-center gap-1 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Actions;
