"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useUpdateCustomerMutation } from "@/redux/features/registeredCustomer/RegisteredCustomerApi";
import { TRegisteredUserStatus } from "@/types/registeredUser";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import { cn } from "@/lib/utils";
import { useState } from "react";

const statusTone: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  banned: "bg-red-50 text-red-700",
  deleted: "bg-slate-100 text-slate-600",
};

const UpdateUserStatus = ({
  status,
  id,
}: {
  status?: TRegisteredUserStatus;
  id: string;
}) => {
  const [open, setOpen] = useState(false);
  const [updateUser, { isLoading }] = useUpdateCustomerMutation();
  const [value, setValue] = useState(status);
  const results: TRegisteredUserStatus[] = ["active", "banned", "deleted"];

  const handleResultChange = async () => {
    try {
      const result = (await updateUser({
        body: { status: value },
        id,
      }).unwrap()) as TSuccessResponse;

      if (result.success) {
        setOpen(false);
        toast({
          className: "toast-success",
          title: result.message,
        });
      }
    } catch (error) {
      const err = error as { data: TErrorResponse };
      toast({
        className: "toast-error",
        title: err?.data?.errorMessages?.[0]?.message || "Update failed",
      });
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
          statusTone[status || ""] || "bg-muted text-muted-foreground"
        )}
      >
        {status}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
            <DialogDescription>
              Change the account status for this customer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Current status:{" "}
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                  statusTone[status || ""] || "bg-muted text-muted-foreground"
                )}
              >
                {status}
              </span>
            </div>

            <Select
              defaultValue={value}
              onValueChange={(changedValue: TRegisteredUserStatus) =>
                setValue(changedValue)
              }
            >
              <SelectTrigger className="w-full capitalize rounded-lg">
                <SelectValue placeholder={value} className="capitalize" />
              </SelectTrigger>
              <SelectContent className="capitalize">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {results.map((item) => (
                    <SelectItem key={item} value={item} className="capitalize">
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="rounded-lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="sm"
                className="rounded-lg"
                disabled={isLoading}
                onClick={handleResultChange}
              >
                {isLoading ? "Updating…" : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateUserStatus;
