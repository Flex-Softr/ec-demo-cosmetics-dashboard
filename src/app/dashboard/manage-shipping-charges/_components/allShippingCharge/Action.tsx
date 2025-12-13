import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TShippingCharge } from "@/redux/features/shippingCharge/shippingChargeInterface";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import DeleteShipping from "./DeleteShipping";
import UpdateDetails from "./UpdateDetails";

const Action = ({ shippingCharge }: { shippingCharge: TShippingCharge }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleOpenEditModal = () => {
    setOpenEditModal((prev) => !prev);
  };
  const [openCDeleteModal, setOpenCDeleteModal] = useState(false);

  const handleOpenCDeleteModal = () => {
    setOpenCDeleteModal((prev) => !prev);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={handleOpenEditModal}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenCDeleteModal}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteShipping
        shippingCharge={shippingCharge}
        open={openCDeleteModal}
        setOpen={setOpenCDeleteModal}
        handleOpen={handleOpenCDeleteModal}
      />
      <UpdateDetails
        shippingCharge={shippingCharge}
        open={openEditModal}
        setOpen={setOpenEditModal}
        handleOpen={handleOpenEditModal}
      />
    </>
  );
};

export default Action;
