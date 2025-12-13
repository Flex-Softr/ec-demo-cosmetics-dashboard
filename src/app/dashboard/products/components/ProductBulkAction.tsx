"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useDeleteProductsMutation } from "@/redux/features/allProducts/allProductsApi";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";

const ProductBulkAction = () => {
  const [action, setAction] = useState("");
  const [deleteProducts, { isLoading }] = useDeleteProductsMutation();
  const { productsIds } = useAppSelector(
    ({ allProducts }) => allProducts.bulkProducts
  );
  const handleSubmit = async () => {
    try {
      if (action === "delete") {
        await deleteProducts(productsIds).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "Products successfully deleted!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Products deleted failed!",
      });
    }
  };

  return (
    <div className={"flex gap-2 items-center"}>
      <Select onValueChange={(value) => setAction(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="Bulk Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="capitalize">
            <SelectItem value="bulk">Bulk Actions</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            {/* <SelectItem value="On courier">Courier Entry</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} disabled={isLoading}>
        Apply
      </Button>
    </div>
  );
};

export default ProductBulkAction;
