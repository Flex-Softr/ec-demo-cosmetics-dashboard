"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TUser } from "@/redux/features/user/userInterface";
import { useDeleteStaffOrAdminMutation } from "@/redux/features/user/userApi";
import { TSuccessResponse } from "@/types/response";
import { TGenericErrorResponse } from "@/utilities/response";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import UpdateUser from "../UpdateUser/UpdateUser";
import CommonAlertDialog from "@/components/common/CommonAlertDialog";
const Action = ({ user }: { user: TUser }) => {
  const [editUserModal, setEditUserModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteUser, { isLoading: isDeleting }] =
    useDeleteStaffOrAdminMutation();
  const { toast } = useToast();

  const handleEditUserModal = () => {
    setEditUserModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      const res = (await deleteUser(user._id).unwrap()) as TSuccessResponse;
      toast({
        className: "toast-success",
        title: res.message,
      });
      setDeleteModal(false);
    } catch (err) {
      const error = err as { data: TGenericErrorResponse };
      toast({
        className: "toast-error",
        title: error?.data?.message || "Failed to delete user",
      });
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 ">
            <DropdownMenuItem
              onClick={() => setEditUserModal(true)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteModal(true)}
              disabled={isDeleting}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <UpdateUser
        editUserModal={editUserModal}
        handleEditUserModal={handleEditUserModal}
        user={user}
        setEditUserModal={setEditUserModal}
      />
      <CommonAlertDialog
        open={deleteModal}
        onOpenChange={setDeleteModal}
        title="Delete User"
        description={`Are you sure you want to delete ${user.fullName}? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={isDeleting}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </>
  );
};

export default Action;
