import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteBrandMutation } from "@/redux/features/brand/brandApi";
import { refetchData } from "@/utilities/fetchData";
import { SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { TBrand } from "../lib/brand.interface";
import UpdateBrandForm from "./UpdateBrandForm";

const BrandActions = ({ brand }: { brand: TBrand }) => {
  const [deleteBrand] = useDeleteBrandMutation();
  const { _id, name, description, logo } = brand;

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDelete = async (id: string) => {
    const categoryIds = [id];
    const res = await deleteBrand(categoryIds).unwrap();
    if (res?.success) {
      await refetchData("brands");
      toast({
        className: "bg-success text-white ",
        title: "Brand deleted successfully!",
      });
    } else {
      toast({
        className: " bg-danger text-whit",
        title: "Something Went Wrong",
      });
    }
  };

  return (
    <span className="flex items-center gap-3 justify-center">
      <Dialog onOpenChange={handleOpen} open={open}>
        <DialogTrigger>
          <SquarePen className="text-green-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Brand</DialogTitle>
            <DialogDescription>
              Modify the details of the brand below.
            </DialogDescription>
          </DialogHeader>
          <div>
            <UpdateBrandForm
              id={_id}
              name={name}
              logo={logo}
              description={description}
              handleOpen={handleOpen}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger>
          <Trash2Icon className="text-red-500" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              brand.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 items-center ">
            <DialogClose asChild>
              <Button className="bg-red-500 hover:bg-red-500">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleDelete(_id)}>Yes, Delete it!</Button>
          </div>
        </DialogContent>
      </Dialog>
    </span>
  );
};

export default BrandActions;
