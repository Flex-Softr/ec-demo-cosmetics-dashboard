"use client";
import CommonAlertDialog from "@/components/common/CommonAlertDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ROLES } from "@/const/role";
import { useDeleteStaffOrAdminMutation } from "@/redux/features/user/userApi";
import { TUser } from "@/redux/features/user/userInterface";
import { TSuccessResponse } from "@/types/response";
import { TGenericErrorResponse } from "@/utilities/response";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Info, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const isProtectedSystemUser = (user: TUser) =>
  Boolean(user.is_system) || user.role === ROLES.SUPER_ADMIN;

const Action = ({ user }: { user: TUser }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteUser, { isLoading: isDeleting }] =
    useDeleteStaffOrAdminMutation();
  const { toast } = useToast();
  const isSystemUser = isProtectedSystemUser(user);

  const handleDelete = async () => {
    if (isSystemUser) {
      toast({
        className: "toast-error",
        title: "System user cannot be deleted",
      });
      return;
    }

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
          <DropdownMenuContent
            className="w-64"
            align="end"
            collisionPadding={16}
          >
            {isSystemUser && (
              <>
                <DropdownMenuLabel className="flex items-start gap-2 font-normal text-muted-foreground whitespace-normal leading-snug">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    This is a system/super admin account. Edit and delete are
                    not allowed.
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {isSystemUser ? (
              <DropdownMenuItem
                disabled
                className="cursor-not-allowed opacity-50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/dashboard/manage-admin-staff/${user._id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                if (!isSystemUser) setDeleteModal(true);
              }}
              disabled={isSystemUser || isDeleting}
              className={
                isSystemUser
                  ? "cursor-not-allowed opacity-50 text-red-600 focus:text-red-600"
                  : "text-red-600 focus:text-red-600 cursor-pointer"
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
