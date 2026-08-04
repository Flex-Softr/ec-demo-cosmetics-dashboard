"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { PERMISSIONS } from "@/const/permissions";
import { formatPermissionLabel } from "@/lib/formatPermissionLabel";
import { cn } from "@/lib/utils";
import { TPermission } from "@/redux/features/permissions/permissionInterface";
import { useAddOrRemovePermissionFromUserMutation } from "@/redux/features/permissions/permissionsAPi";
import { TUser } from "@/redux/features/user/userInterface";
import { TSuccessResponse } from "@/types/response";
import { TGenericErrorResponse } from "@/utilities/response";
import { Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ASSIGNABLE_PERMISSIONS = [
  {
    fieldName: PERMISSIONS.MANAGE_ADMIN_OR_STAFF,
    description: "Manage admin and staff",
  },
  {
    fieldName: PERMISSIONS.MANAGE_SHIPPING_CHARGE,
    description: "Can manage shipping charges",
  },
  {
    fieldName: PERMISSIONS.MANAGE_COUPON,
    description: "Can add or delete coupons",
  },
  {
    fieldName: PERMISSIONS.MANAGE_PERMISSION,
    description: "Can add new permission",
  },
  {
    fieldName: PERMISSIONS.MANAGE_ORDER,
    description: "Can manage orders",
  },
  {
    fieldName: PERMISSIONS.MANAGE_PROCESSING_ORDER,
    description: "Can manage processing orders and can add warranty codes",
  },
  {
    fieldName: PERMISSIONS.MANAGE_SHIPMENT_ORDER,
    description: "Can book courier",
  },
  {
    fieldName: PERMISSIONS.MANAGE_WARRANTY_CLAIM,
    description: "Can manage warranty claims",
  },
  {
    fieldName: PERMISSIONS.MANAGE_PRODUCT,
    description: "Can manage products",
  },
  {
    fieldName: PERMISSIONS.MANAGE_BLOG,
    description: "Can manage blog posts, QnA, categories and tags",
  },
  {
    fieldName: PERMISSIONS.MANAGE_SMS,
    description: "Can send sms",
  },
  {
    fieldName: PERMISSIONS.MANAGE_CUSTOMER,
    description: "Can manage customers",
  },
] as const;

const PermissionTable = ({
  permissionData,
  user,
  isCreate = false,
  onPermissionChange,
  selectedPermissions: externalSelectedPermissions,
}: {
  permissionData: TPermission[];
  user?: TUser;
  isCreate?: boolean;
  onPermissionChange?: (permissionIds: string[]) => void;
  selectedPermissions?: string[];
}) => {
  const [addRemovePermission, { isLoading }] =
    useAddOrRemovePermissionFromUserMutation();
  const { toast } = useToast();

  const formFieldData = useMemo(
    () =>
      ASSIGNABLE_PERMISSIONS.map((item) => {
        const permission = permissionData.find(
          (p) => p.name === item.fieldName
        );
        return {
          ...item,
          _id: permission?._id,
          name: permission?.name || item.fieldName,
        };
      }).filter((item) => item._id),
    [permissionData]
  );

  const getInitialSelected = () => {
    if (externalSelectedPermissions) {
      return new Set(externalSelectedPermissions);
    }
    return new Set(
      (user?.permissions || [])
        .filter((p) => p.name !== PERMISSIONS.SUPER_ADMIN)
        .map((p) => p._id)
    );
  };

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(getInitialSelected);

  useEffect(() => {
    if (externalSelectedPermissions) {
      setSelectedIds(new Set(externalSelectedPermissions));
    }
  }, [externalSelectedPermissions]);

  const syncSelection = (next: Set<string>) => {
    setSelectedIds(next);
    onPermissionChange?.(Array.from(next));
  };

  const togglePermission = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    syncSelection(next);
  };

  const allSelected =
    formFieldData.length > 0 &&
    formFieldData.every((item) => item._id && selectedIds.has(item._id));

  const toggleSelectAll = () => {
    if (allSelected) {
      syncSelection(new Set());
      return;
    }
    syncSelection(
      new Set(formFieldData.map((item) => item._id).filter(Boolean) as string[])
    );
  };

  async function handleStandaloneUpdate() {
    if (onPermissionChange || isCreate) return;

    try {
      const res = (await addRemovePermission({
        useId: user?._id as string,
        permissions: Array.from(selectedIds),
      }).unwrap()) as TSuccessResponse;
      toast({
        className: "toast-success",
        title: res.message,
      });
    } catch (err) {
      const error = err as { data: TGenericErrorResponse };
      toast({
        className: "toast-error",
        title: error.data.message,
      });
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Permissions
            </h3>
            <p className="text-xs text-muted-foreground">
              Select what this admin can access
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {selectedIds.size} selected
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={toggleSelectAll}
          >
            {allSelected ? "Clear all" : "Select all"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {formFieldData.map((item) => {
          const id = item._id as string;
          const checked = selectedIds.has(id);
          const labelId = `permission-${id}`;

          return (
            <label
              key={id}
              htmlFor={labelId}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                checked
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card hover:bg-muted/40"
              )}
            >
              <Checkbox
                id={labelId}
                checked={checked}
                onCheckedChange={(value) =>
                  togglePermission(id, value === true)
                }
                className="mt-0.5"
              />
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium leading-snug text-foreground">
                  {formatPermissionLabel(item.name)}
                </p>
                <p className="text-xs leading-snug text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {!isCreate && !onPermissionChange && (
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleStandaloneUpdate}
          >
            Update permission
          </Button>
        </div>
      )}
    </div>
  );
};

export default PermissionTable;
