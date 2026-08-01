"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteCollectionMutation } from "@/redux/features/collection/collectionApi";
import { ICollection } from "@/types/collection";
import { SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import CollectionForm from "./CollectionForm";
import { revalidateTag } from "@/utilities/revalidate";

const CollectionAction = ({ collection }: { collection: ICollection }) => {
  const [deleteCollection] = useDeleteCollectionMutation();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteCollection(collection._id).unwrap();
      if (res?.success) {
        toast({
          className: "bg-success text-white",
          title: "Collection deleted successfully",
        });
        setDeleteOpen(false);
        await revalidateTag(["collections"]);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Failed to delete collection",
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-0.5">
      {/* Edit Action */}
      <CollectionForm
        open={editOpen}
        setOpen={setEditOpen}
        initialData={collection}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditOpen(true)}
            className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        }
      />

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
            Delete Collection?
          </h1>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {collection.name}
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

export default CollectionAction;
