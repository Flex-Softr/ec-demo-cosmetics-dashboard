"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteAttributeMutation } from "@/redux/features/attributes/attributesApi";
import { TAttribute } from "../lib/attribute.interface";
import { SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import AttributeValueUpdateModal from "./AttributeValueUpdateModal";

const AttributeAction = ({ attribute }: { attribute: TAttribute }) => {
  const [deleteAttribute] = useDeleteAttributeMutation();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteAttribute({
        attributeIds: [attribute._id],
      }).unwrap();
      if (res?.success) {
        toast({
          className: "bg-success text-white",
          title: "Attribute deleted successfully",
        });
        setDeleteOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: res?.message || "Failed to delete attribute",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Failed to delete attribute",
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-0.5">
      {/* Configure Terms Action */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-fit max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <AttributeValueUpdateModal attribute={attribute} />
        </DialogContent>
      </Dialog>

      {/* Delete Action */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <h1 className="text-lg font-semibold text-foreground">
            Delete Attribute?
          </h1>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {attribute.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-lg"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttributeAction;
